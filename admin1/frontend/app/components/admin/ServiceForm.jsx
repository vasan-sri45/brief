"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useCreateServiceConfig, useUpdateServiceConfig } from "../../hooks/useService";

const SERVICE_TITLE_OPTIONS = [
  "Startup",
  "Intellectual Property",
  "Tax Filing",
  "MCA Compliance",
  "Registration",
  "Legal Advisory & Agreement",
  "Other Services",
];

const SERVICE_SUBTITLE_OPTIONS = {
  Startup: [
    "Company Registration",
    "Special Business Entities",
    "General Registration",
  ],
  "Intellectual Property": [
    "Trademark Services",
    "Copyright & Patents",
    "IP Protection",
  ],
  "Tax Filing": [
    "Tax Registration",
    "Tax Filing",
    "Compliance Services",
  ],
  "MCA Compliance": [
    "MCA Compliance",
    "ROC Compliance",
    "Director Compliance",
  ],
  Registration: [
    "Tax Registration",
    "Business Registration",
    "License Registration",
  ],
  "Legal Advisory & Agreement": [
    "Business Agreements",
    "Corporate Documents",
    "Legal Notices",
  ],
  "Other Services": [
    "Financial Services",
    "Business Consulting",
    "Digital Services",
  ],
};

const getSubtitleOptions = (title) => SERVICE_SUBTITLE_OPTIONS[title] || [];

const getYouTubeVideoId = (url = "") => {
  const value = String(url || "").trim();
  if (!value) return "";

  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
  ];

  const match = patterns.map((pattern) => value.match(pattern)).find(Boolean);
  return match?.[1] || "";
};

const getYouTubeThumbnail = (url = "") => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

export default function CreateServicePage({ initialService = null, onDone }) {
  const createService = useCreateServiceConfig();
  const updateService = useUpdateServiceConfig();
  const isEditMode = Boolean(initialService?._id);
  const [cardPreviewLoaded, setCardPreviewLoaded] = useState(false);
  const [mediaPreviewLoaded, setMediaPreviewLoaded] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      subTitle: "",
      slug: "",
      heading: "",
      description: "",
      shortDescription: "",
      fullDescription: "",
      serviceIcon: "",
      serviceBannerImage: "",
      featuredImage: "",
      cardImageUrl: "",
      cardImageFile: "",
      mediaType: "image",
      mediaUrl: "",
      mediaFile: "",
      serviceCategory: "",
      displayOrder: 0,
      status: "Active",
      seoTitle: "",
      metaDescription: "",
      metaKeywords: "",

      documents: [{ name: "", details: "" }],
      process: [{ days: "", step: 1, title: "", details: "" }],
      processAtBriefcase: [{ days: "", step: 1, title: "", details: "" }],
      content: [{ name: "", details: "" }],
      custom: [{ name: "", details: "" }],
      trademark: [{ name: "", details: "" }],
      faqs: [{ question: "", answer: "", displayOrder: 1 }],
      prices: [{ amount: "", type: "payment", features: [""] }],
    },
  });

  useEffect(() => {
    if (!initialService) return;

    reset({
      title: initialService.title || "",
      subTitle: initialService.subTitle || "",
      slug: initialService.slug || "",
      heading: initialService.heading || "",
      description: initialService.description || "",
      shortDescription: initialService.shortDescription || "",
      fullDescription: initialService.fullDescription || "",
      serviceIcon: initialService.serviceIcon || "",
      serviceBannerImage: initialService.serviceBannerImage || "",
      featuredImage: initialService.featuredImage || "",
      cardImageUrl: initialService.cardImageUrl || "",
      cardImageFile: initialService.cardImageFile || "",
      mediaType: initialService.mediaType || "image",
      mediaUrl: initialService.mediaUrl || "",
      mediaFile: initialService.mediaFile || "",
      serviceCategory: initialService.serviceCategory || "",
      displayOrder: initialService.displayOrder || 0,
      status: initialService.status || "Active",
      seoTitle: initialService.seoTitle || "",
      metaDescription: initialService.metaDescription || "",
      metaKeywords: initialService.metaKeywords || "",
      documents: initialService.documents?.length ? initialService.documents : [{ name: "", details: "" }],
      process: initialService.process?.length ? initialService.process : [{ days: "", step: 1, title: "", details: "" }],
      processAtBriefcase: initialService.processAtBriefcase?.length ? initialService.processAtBriefcase : [{ days: "", step: 1, title: "", details: "" }],
      content: initialService.content?.length ? initialService.content : [{ name: "", details: "" }],
      custom: initialService.custom?.length ? initialService.custom : [{ name: "", details: "" }],
      trademark: initialService.trademark?.length ? initialService.trademark : [{ name: "", details: "" }],
      faqs: initialService.faqs?.length ? initialService.faqs : [{ question: "", answer: "", displayOrder: 1 }],
      prices: initialService.prices?.length ? initialService.prices : [{ amount: "", type: "payment", features: [""] }],
    });
  }, [initialService, reset]);

  // Watch entire form state for the live preview side panel
  const formData = watch();
  const subtitleOptions = getSubtitleOptions(formData.title);
  const visibleSubtitleOptions =
    formData.subTitle && !subtitleOptions.includes(formData.subTitle)
      ? [formData.subTitle, ...subtitleOptions]
      : subtitleOptions;
  const mediaPreviewUrl =
    formData.mediaFile ||
    formData.mediaUrl ||
    formData.featuredImage ||
    formData.serviceBannerImage ||
    initialService?.images?.[0]?.url ||
    "";
  const cardPreviewUrl =
    formData.cardImageFile ||
    formData.cardImageUrl ||
    formData.featuredImage ||
    "";

  // Handle Slug generation automatically from the service heading.
  useEffect(() => {
    if (formData.heading) {
      const generatedSlug = formData.heading
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setValue("slug", generatedSlug, { shouldValidate: true, shouldDirty: true });
    } else {
      setValue("slug", "");
    }
  }, [formData.heading, setValue]);

  useEffect(() => {
    setCardPreviewLoaded(false);
  }, [cardPreviewUrl]);

  useEffect(() => {
    setMediaPreviewLoaded(false);
  }, [mediaPreviewUrl]);

  const readImageFile = (file, targetField, urlField) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setValue(targetField, reader.result || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(urlField, "", { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const handleCardImageFileChange = (event) => {
    readImageFile(event.target.files?.[0], "cardImageFile", "cardImageUrl");
  };

  const handleMediaFileChange = (event) => {
    readImageFile(event.target.files?.[0], "mediaFile", "mediaUrl");
  };

  const handleImageDrop = (event, targetField, urlField) => {
    event.preventDefault();
    readImageFile(event.dataTransfer.files?.[0], targetField, urlField);
  };

  // ================= FIELD ARRAYS =================
  const { fields: documentFields, append: addDocument, remove: removeDocument } = useFieldArray({ control, name: "documents" });
  const { fields: processFields, append: addProcess, remove: removeProcess } = useFieldArray({ control, name: "process" });
  const { fields: briefcaseFields, append: addBriefcase, remove: removeBriefcase } = useFieldArray({ control, name: "processAtBriefcase" });
  const { fields: contentFields, append: addContent, remove: removeContent } = useFieldArray({ control, name: "content" });
  const { fields: customFields, append: addCustom, remove: removeCustom } = useFieldArray({ control, name: "custom" });
  const { fields: trademarkFields, append: addTrademark, remove: removeTrademark } = useFieldArray({ control, name: "trademark" });
  const { fields: faqFields, append: addFaq, remove: removeFaq, move: moveFaq } = useFieldArray({ control, name: "faqs" });
  const { fields: priceFields, append: addPrice, remove: removePrice } = useFieldArray({ control, name: "prices" });

  // ================= SUBMIT =================
  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      delete payload.canonicalUrl;
      delete payload.openGraphTitle;
      delete payload.openGraphDescription;
      delete payload.openGraphImage;
      delete payload.schemaMarkupJson;

      if (isEditMode) {
        await updateService.mutateAsync({
          id: initialService._id,
          payload,
        });
        alert("Service updated successfully");
      } else {
        await createService.mutateAsync(payload);
        alert("Service created successfully");
      }
      reset();
      onDone?.();
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 py-6 px-4 md:px-8">
      {/* 2-Column Responsive Matrix */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT SIDE: FORM ================= */}
        <div className="lg:col-span-7 rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] md:p-7">
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
              Admin Service Builder
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-wide md:text-3xl">
              {isEditMode ? "Edit Service Configuration" : "Create Service Configuration"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Configure service content, documents, workflow steps, and pricing in one place.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* BASIC INFO */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">Title</label>
                  <select
                    {...register("title", {
                      onChange: (event) => {
                        const options = getSubtitleOptions(event.target.value);
                        setValue("subTitle", options[0] || "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      },
                    })}
                    className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select service title</option>
                    {SERVICE_TITLE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">Subtitle</label>
                  <select
                    {...register("subTitle")}
                    disabled={!formData.title}
                    className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">Select subtitle</option>
                    {visibleSubtitleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">Slug (Auto-Generated)</label>
                  <input {...register("slug")} readOnly placeholder="auto-generated-slug" className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm text-slate-500 outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">Heading</label>
                  <input {...register("heading")} placeholder="Enter heading" className="rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Description</label>
                <textarea {...register("description")} placeholder="Enter description details..." rows={3} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input {...register("shortDescription")} placeholder="Short Description" className="rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                <input type="number" {...register("displayOrder")} placeholder="Display Order" className="rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                <select {...register("status")} className="rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-4 space-y-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700">Card Swiper Image</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  This image appears only inside the service card slider.
                </p>
              </div>

              <input type="hidden" {...register("cardImageFile")} />

              <div
                onDrop={(event) => handleImageDrop(event, "cardImageFile", "cardImageUrl")}
                onDragOver={(event) => event.preventDefault()}
                className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-4 transition hover:border-blue-400"
              >
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-white p-5 text-center shadow-sm">
                  <span className="text-sm font-bold text-blue-700">Drag & drop card image here</span>
                  <span className="text-xs font-semibold text-slate-500">or choose an image from your device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCardImageFileChange}
                    className="hidden"
                  />
                  <span className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm">
                    Choose Image
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Card Image URL</label>
                <input
                  {...register("cardImageUrl", {
                    onChange: () => setValue("cardImageFile", "", { shouldDirty: true }),
                  })}
                  placeholder="Image URL for card slider"
                  className="rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {cardPreviewUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  {!cardPreviewLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-blue-100" />
                  )}
                  <img
                    src={cardPreviewUrl}
                    alt="Card swiper preview"
                    onLoad={() => setCardPreviewLoaded(true)}
                    className={`h-48 w-full object-contain transition-opacity duration-500 ${
                      cardPreviewLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-blue-100 bg-blue-50/50 p-6 text-center text-sm font-semibold text-blue-600">
                  Card image preview will appear here.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-blue-100 bg-white p-4 space-y-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700">Service Page Media</h2>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  This media appears on the service details page and can be an image or YouTube video.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-600">Media Type</label>
                  <select
                    {...register("mediaType")}
                    className="rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="image">Image</option>
                    <option value="youtube">YouTube Video</option>
                  </select>
                  <input type="hidden" {...register("mediaFile")} />
                </div>

                {formData.mediaType !== "youtube" && (
                  <div
                    onDrop={(event) => handleImageDrop(event, "mediaFile", "mediaUrl")}
                    onDragOver={(event) => event.preventDefault()}
                    className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-3 transition hover:border-blue-400"
                  >
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl bg-white p-4 text-center shadow-sm">
                      <span className="text-xs font-bold text-blue-700">Drag & drop page image</span>
                      <span className="text-[11px] font-semibold text-slate-500">or choose image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMediaFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {formData.mediaType !== "youtube" && (
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">Enter URL</label>
                    <input
                      {...register("mediaUrl", {
                        onChange: () => setValue("mediaFile", "", { shouldDirty: true }),
                      })}
                      placeholder="Image URL"
                      className="rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}

                {formData.mediaType === "youtube" && (
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600">YouTube URL</label>
                    <input
                      {...register("mediaUrl", {
                        onChange: () => setValue("mediaFile", "", { shouldDirty: true }),
                      })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}
              </div>

              {mediaPreviewUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  {formData.mediaType === "youtube" ? (
                    <div className="relative h-64 w-full bg-slate-900">
                      {getYouTubeThumbnail(mediaPreviewUrl) ? (
                        <img
                          src={getYouTubeThumbnail(mediaPreviewUrl)}
                          alt="Service YouTube thumbnail preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-300">
                          Enter a valid YouTube URL to preview the thumbnail.
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                        <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-blue-700 shadow-lg">
                          YouTube Video Preview
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-64 w-full">
                      {!mediaPreviewLoaded && (
                        <div className="absolute inset-0 animate-pulse bg-blue-100" />
                      )}
                      <img
                        src={mediaPreviewUrl}
                        alt="Service media preview"
                        onLoad={() => setMediaPreviewLoaded(true)}
                        className={`h-full w-full object-cover transition-opacity duration-500 ${
                          mediaPreviewLoaded ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-blue-100 bg-blue-50/50 p-6 text-center text-sm font-semibold text-blue-600">
                  Media preview will appear here.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700">SEO Metadata</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input {...register("seoTitle", { maxLength: 60 })} placeholder="SEO Title" maxLength={60} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  <p className="mt-1 text-xs font-semibold text-slate-500">{(formData.seoTitle || "").length}/60</p>
                </div>
                <div className="md:col-span-2">
                  <textarea {...register("metaDescription", { maxLength: 160 })} placeholder="Meta Description" maxLength={160} rows={3} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                  <p className="mt-1 text-xs font-semibold text-slate-500">{(formData.metaDescription || "").length}/160</p>
                </div>
                <input {...register("metaKeywords")} placeholder="Meta Keywords" className="rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase text-blue-600">Search Preview</p>
                <h3 className="mt-2 text-lg font-bold text-blue-700">{formData.seoTitle || formData.heading || "Service SEO Title"}</h3>
                <p className="text-sm text-emerald-700">{`/services/${formData.slug || "service-slug"}`}</p>
                <p className="mt-1 text-sm text-slate-600">{formData.metaDescription || formData.shortDescription || "Meta description preview appears here."}</p>
              </div>
            </div>

            {/* DOCUMENTS */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Documents</h2>
                <button type="button" onClick={() => addDocument({ name: "", details: "" })} className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  + Add Document
                </button>
              </div>
              <div className="space-y-3">
                {documentFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-150 relative">
                    <input {...register(`documents.${index}.name`)} placeholder="Document Name" className="border rounded-lg p-2 text-sm bg-white" />
                    <input {...register(`documents.${index}.details`)} placeholder="Document Details" className="border rounded-lg p-2 text-sm bg-white" />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeDocument(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROCESS */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Process Flow</h2>
                <button type="button" onClick={() => addProcess({ days: "", step: processFields.length + 1, title: "", details: "" })} className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  + Add Step
                </button>
              </div>
              <div className="space-y-3">
                {processFields.map((field, index) => (
                  <div key={field.id} className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <input type="number" {...register(`process.${index}.step`)} placeholder="Step No." className="border rounded-lg p-2 text-sm bg-white" />
                      <input {...register(`process.${index}.days`)} placeholder="Days" className="border rounded-lg p-2 text-sm bg-white" />
                      <input {...register(`process.${index}.title`)} placeholder="Step Title" className="border rounded-lg p-2 text-sm bg-white md:col-span-2" />
                    </div>
                    <textarea {...register(`process.${index}.details`)} placeholder="Step details..." rows={2} className="border rounded-lg p-2 text-sm w-full bg-white" />
                    <div className="flex justify-end">
                      <button type="button" onClick={() => removeProcess(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROCESS AT BRIEFCASE */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Process At Briefcase</h2>
                <button type="button" onClick={() => addBriefcase({ days: "", step: briefcaseFields.length + 1, title: "", details: "" })} className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  + Add Step
                </button>
              </div>
              <div className="space-y-3">
                {briefcaseFields.map((field, index) => (
                  <div key={field.id} className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <input type="number" {...register(`processAtBriefcase.${index}.step`)} placeholder="Step No." className="border rounded-lg p-2 text-sm bg-white" />
                      <input {...register(`processAtBriefcase.${index}.days`)} placeholder="Days" className="border rounded-lg p-2 text-sm bg-white" />
                      <input {...register(`processAtBriefcase.${index}.title`)} placeholder="Step Title" className="border rounded-lg p-2 text-sm bg-white md:col-span-2" />
                    </div>
                    <textarea {...register(`processAtBriefcase.${index}.details`)} placeholder="Step details..." rows={2} className="border rounded-lg p-2 text-sm w-full bg-white" />
                    <div className="flex justify-end">
                      <button type="button" onClick={() => removeBriefcase(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTENT */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Content</h2>
                <button type="button" onClick={() => addContent({ name: "", details: "" })} className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  + Add Content
                </button>
              </div>
              <div className="space-y-3">
                {contentFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-150">
                    <input {...register(`content.${index}.name`)} placeholder="Content Name" className="border rounded-lg p-2 text-sm bg-white" />
                    <input {...register(`content.${index}.details`)} placeholder="Content Details" className="border rounded-lg p-2 text-sm bg-white" />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeContent(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CUSTOM FIELDS */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Custom Fields</h2>
                <button type="button" onClick={() => addCustom({ name: "", details: "" })} className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  + Add Custom
                </button>
              </div>
              <div className="space-y-3">
                {customFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-150">
                    <input {...register(`custom.${index}.name`)} placeholder="Custom Field Name" className="border rounded-lg p-2 text-sm bg-white" />
                    <input {...register(`custom.${index}.details`)} placeholder="Custom Details" className="border rounded-lg p-2 text-sm bg-white" />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeCustom(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRADEMARK */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Trademark</h2>
                <button type="button" onClick={() => addTrademark({ name: "", details: "" })} className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  + Add Trademark
                </button>
              </div>
              <div className="space-y-3">
                {trademarkFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-150">
                    <input {...register(`trademark.${index}.name`)} placeholder="Trademark Name" className="border rounded-lg p-2 text-sm bg-white" />
                    <input {...register(`trademark.${index}.details`)} placeholder="Trademark Details" className="border rounded-lg p-2 text-sm bg-white" />
                    <div className="md:col-span-2 flex justify-end">
                      <button type="button" onClick={() => removeTrademark(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRICING PLANS */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Frequently Asked Questions</h2>
                <button type="button" onClick={() => addFaq({ question: "", answer: "", displayOrder: faqFields.length + 1 })} className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  + Add FAQ
                </button>
              </div>
              <div className="space-y-3">
                {faqFields.map((field, index) => (
                  <div key={field.id} className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-[90px_1fr] gap-2">
                      <input type="number" {...register(`faqs.${index}.displayOrder`)} placeholder="Order" className="border rounded-lg p-2 text-sm bg-white" />
                      <input {...register(`faqs.${index}.question`)} placeholder="Question" className="border rounded-lg p-2 text-sm bg-white" />
                    </div>
                    <textarea {...register(`faqs.${index}.answer`)} placeholder="Answer" rows={3} className="border rounded-lg p-2 text-sm w-full bg-white" />
                    <div className="flex flex-wrap justify-end gap-2">
                      <button type="button" onClick={() => index > 0 && moveFaq(index, index - 1)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Move Up</button>
                      <button type="button" onClick={() => index < faqFields.length - 1 && moveFaq(index, index + 1)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Move Down</button>
                      <button type="button" onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Pricing Plans</h2>
                <button type="button" onClick={() => addPrice({ amount: "", type: "payment", features: [""] })} className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                  + Add Pricing
                </button>
              </div>
              <div className="space-y-3">
                {priceFields.map((field, index) => (
                  <div key={field.id} className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input {...register(`prices.${index}.amount`)} placeholder="Amount (e.g. 4999)" className="border rounded-lg p-2 text-sm bg-white" />
                      <select {...register(`prices.${index}.type`)} className="border rounded-lg p-2 text-sm bg-white">
                        <option value="payment">Payment</option>
                        <option value="contact">Contact</option>
                      </select>
                    </div>
                    <input {...register(`prices.${index}.features.0`)} placeholder="Primary Feature / Description" className="border rounded-lg p-2 text-sm w-full bg-white" />
                    <div className="flex justify-end">
                      <button type="button" onClick={() => removePrice(index)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION SUBMIT */}
            <div className="pt-2">
              <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:scale-[1.01] disabled:opacity-60">
                {createService.isPending || updateService.isPending
                  ? "Saving..."
                  : isEditMode
                  ? "Update Service Data"
                  : "Publish Service Data"}
              </button>
              {onDone && (
                <button
                  type="button"
                  onClick={onDone}
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= RIGHT SIDE: LIVE SERVICE DETAILS PREVIEW ================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 bg-slate-900 text-slate-100 shadow-xl rounded-xl p-6 overflow-y-auto max-h-[calc(100vh-3rem)] border border-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Preview
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">Read-Only View</span>
          </div>

          {/* Dynamic Content Mapping Container */}
          <div className="space-y-6 text-sm">
            
            {/* Header / Basic Information Panel */}
            <div className="space-y-1 bg-slate-800/50 p-4 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase text-indigo-400 font-bold tracking-widest block">Main Info</span>
              <h3 className="text-xl font-extrabold text-white break-words">
                {formData.title || <span className="text-slate-600 italic">Untitled Service</span>}
              </h3>
              <p className="text-slate-400 font-medium text-xs break-words">{formData.subTitle || "No subtitle specified"}</p>
              
              <div className="pt-2 grid grid-cols-2 gap-2 text-xs border-t border-slate-800 mt-2">
                <div>
                  <span className="text-slate-500 block">Slug:</span>
                  <span className="font-mono text-emerald-400 break-all">{formData.slug || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Heading Section:</span>
                  <span className="text-slate-300 font-medium break-words">{formData.heading || "—"}</span>
                </div>
              </div>
              
            {formData.description && (
              <div className="pt-2 mt-2 border-t border-slate-800">
                <span className="text-slate-500 text-xs block">Description Content:</span>
                <p className="text-slate-300 text-xs mt-1 bg-slate-900/40 p-2 rounded border border-slate-800 break-words whitespace-pre-line">{formData.description}</p>
              </div>
            )}

              <div className="pt-2 grid grid-cols-2 gap-2 text-xs border-t border-slate-800 mt-2">
                <div>
                  <span className="text-slate-500 block">Category:</span>
                  <span className="text-slate-300">{formData.serviceCategory || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status:</span>
                  <span className={formData.status === "Inactive" ? "text-amber-300" : "text-emerald-300"}>{formData.status || "Active"}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase text-emerald-400 font-bold tracking-widest block">SEO Preview</span>
              <h3 className="mt-2 text-base font-bold text-blue-300 break-words">
                {formData.seoTitle || formData.heading || "Service SEO Title"}
              </h3>
              <p className="text-xs text-emerald-300 break-all">
                {`/services/${formData.slug || "service-slug"}`}
              </p>
              <p className="mt-1 text-xs text-slate-400 break-words">
                {formData.metaDescription || formData.shortDescription || "Meta description preview appears here."}
              </p>
            </div>

            {/* Pricing Tiers Preview */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Configured Cost Plans</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.prices?.map((item, index) => (
                  <div key={index} className="bg-slate-800 border border-slate-700/60 p-3 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900">{item.type}</span>
                        <span className="text-slate-500 text-[11px]">Plan #{index + 1}</span>
                      </div>
                      <div className="text-xl font-black text-white">
                        {item.amount ? `₹${Number(item.amount).toLocaleString()}` : <span className="text-slate-600 italic text-sm">No price</span>}
                      </div>
                    </div>
                    {item.features?.[0] && (
                      <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-700/50 italic break-words">
                        “ {item.features[0]} ”
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents List */}
            {formData.faqs?.some((faq) => faq.question || faq.answer) && (
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">FAQ Schema Preview</h4>
                <div className="space-y-2">
                  {formData.faqs.map((faq, idx) => (
                    (faq.question || faq.answer) && (
                      <div key={idx} className="bg-slate-800/40 border border-slate-800/80 p-2 rounded">
                        <p className="font-bold text-slate-200 text-xs">{faq.question || "Untitled question"}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{faq.answer || "No answer yet."}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Required Documentation ({formData.documents?.length || 0})</h4>
              <ul className="space-y-1.5">
                {formData.documents?.map((doc, idx) => (
                  <li key={idx} className="bg-slate-800/40 border border-slate-800/80 p-2 rounded flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-200 text-xs break-words">{doc.name || <span className="text-slate-600 italic">Empty Doc Asset</span>}</span>
                    {doc.details && <span className="text-slate-400 text-[11px] break-words">{doc.details}</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Process Checklist Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Internal / standard process */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Standard Flow</h4>
                <div className="space-y-2 border-l border-indigo-500/30 pl-2">
                  {formData.process?.map((proc, idx) => (
                    <div key={idx} className="bg-slate-800/30 p-2 rounded border border-slate-800/70 text-xs relative">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-0.5">
                        <span>Step {proc.step || idx + 1}</span>
                        <span className="text-indigo-400">{proc.days ? `${proc.days} days` : ""}</span>
                      </div>
                      <div className="font-bold text-slate-300 break-words">{proc.title || "—"}</div>
                      {proc.details && <p className="text-slate-400 text-[11px] mt-0.5 break-words">{proc.details}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Briefcase Process */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Briefcase Hub Flow</h4>
                <div className="space-y-2 border-l border-emerald-500/30 pl-2">
                  {formData.processAtBriefcase?.map((proc, idx) => (
                    <div key={idx} className="bg-slate-800/30 p-2 rounded border border-slate-800/70 text-xs">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-0.5">
                        <span>Step {proc.step || idx + 1}</span>
                        <span className="text-emerald-400">{proc.days ? `${proc.days} days` : ""}</span>
                      </div>
                      <div className="font-bold text-slate-300 break-words">{proc.title || "—"}</div>
                      {proc.details && <p className="text-slate-400 text-[11px] mt-0.5 break-words">{proc.details}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Context/Content & Misc Metadata Badges */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {/* Content block preview */}
              {formData.content?.[0]?.name && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 mb-1">Injected Content Blocks</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.content.map((c, i) => c.name && (
                      <span key={i} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700" title={c.details}>
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Trademark entries preview */}
              {formData.trademark?.[0]?.name && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 mb-1">Trademark Entities</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.trademark.map((t, i) => t.name && (
                      <span key={i} className="text-[11px] bg-indigo-950/40 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/60" title={t.details}>
                        ™ {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom fields structural footprint */}
              {formData.custom?.[0]?.name && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase text-slate-500 mb-1">Custom Context Parameters</h5>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded border border-slate-900 text-[11px]">
                    {formData.custom.map((cust, i) => cust.name && (
                      <div key={i} className="break-words">
                        <span className="text-slate-500 font-mono block">{cust.name}:</span>
                        <span className="text-slate-300">{cust.details || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
