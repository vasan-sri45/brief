
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
         allow: [
          "/",
          "/user/contact",  
        ],
        disallow: [
          //  "/user/", 
          "/api/",      
          "/login/",    
          "/store/",   
        ],
      },
    ],
    sitemap: "https://briefcasse.com/sitemap.xml",
    // host: "https://briefcasse.com",
  };
}


