import Blog from '../../models/admin/blog.model.js'; // adjust path to your Blog model
import { uploadToCloudinary, cloudinary } from '../../helpers/cloudinary.js'; // your Cloudinary helper

export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      content,
      status = 'published',
      metaTitle = '',
      metaDescription = '',
      tags = '',
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    /* ================= DOCUMENT UPLOAD ================= */
    const files = Array.isArray(req.files?.documents)
      ? req.files.documents
      : [];

    const documents = [];

    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, {
        resource_type: 'auto'
      });

      documents.push({
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
        mimetype: file.mimetype,
      });
    }

    /* ================= SLUG ================= */
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const exists = await Blog.findOne({ slug });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Blog with this title already exists'
      });
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      tags: typeof tags === 'string'
        ? tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : tags,
      documents,
      status,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};


// GET /api/admin/blogs
export const getAllBlogs = async (req, res, next) => {
  try {
    const pageNumber = Math.max(1, Number(req.query.page) || 1);
    const limitNumber = Math.min(30, Math.max(1, Number(req.query.limit) || 10));
    const search = String(req.query.search || "").trim();

    const query = {
      isDeleted: false,
      status: 'published',
      ...(search ? { title: { $regex: search, $options: 'i' } } : {}),
    };

    const blogs = await Blog.find(query)
      .select("title slug content excerpt documents status views createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: blogs,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/blogs/:slug
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug,
      isDeleted: false,
      status: 'published',
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Optional view counter
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/blogs/:id
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      status,
      metaTitle,
      metaDescription,
      tags,
    } = req.body;

    const blog = await Blog.findById(id);
    if (!blog || blog.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    if (title) {
      blog.title = title;
      blog.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (content) blog.content = content;
    if (status) blog.status = status;
    if (metaTitle !== undefined) blog.metaTitle = metaTitle;
    if (metaDescription !== undefined) blog.metaDescription = metaDescription;
    if (tags !== undefined) {
      blog.tags = typeof tags === 'string'
        ? tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : tags;
    }

    /* ================= ADD NEW DOCUMENTS ================= */
    const files = Array.isArray(req.files?.documents)
      ? req.files.documents
      : [];

    for (const file of files) {
      const result = await uploadToCloudinary(file.buffer, {
        resource_type: 'auto',
      });

      blog.documents.push({
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
        mimetype: file.mimetype,
      });
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    /* ================= DELETE CLOUDINARY DOCUMENTS ================= */
    if (blog.documents && blog.documents.length > 0) {
      for (const doc of blog.documents) {
        if (!doc.publicId) continue;

        let resourceType = 'image'; // default

        if (doc.mimetype === 'application/pdf') {
          resourceType = 'raw';
        } else if (doc.mimetype.startsWith('video/')) {
          resourceType = 'video';
        }

        await cloudinary.uploader.destroy(doc.publicId, {
          resource_type: resourceType,
        });
      }
    }

    /* ================= HARD DELETE BLOG ================= */
    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Blog permanently deleted',
    });
  } catch (error) {
    next(error);
  }
};

