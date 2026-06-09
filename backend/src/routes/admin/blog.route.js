import { Router } from 'express';
import {wrapAsync} from '../../utils/wrapAsync.js';
import { upload } from '../../helpers/cloudinary.js';
import { employeeProtectRoute, allowRoles } from '../../middleware/protectRoute.js';
import { createBlog, getAllBlogs, getBlogBySlug, deleteBlog, updateBlog } from '../../controllers/admin/blog.controller.js';

const router = Router();

router.post("/admin/blogs",employeeProtectRoute,allowRoles(['admin']), upload.fields([{ name: 'documents', maxCount: 5 }]), wrapAsync(createBlog));
router.put(
  '/admin/blogs/:id',
  employeeProtectRoute,
  allowRoles(['admin']),
  upload.fields([{ name: 'documents', maxCount: 5 }]),
  wrapAsync(updateBlog)
);
router.delete(
  '/admin/blogs/:id',
  employeeProtectRoute,
  allowRoles(['admin']),
  wrapAsync(deleteBlog)
);

router.get("/blogs",wrapAsync(getAllBlogs));
router.get('/blogs/:slug', wrapAsync(getBlogBySlug));

export default router;


