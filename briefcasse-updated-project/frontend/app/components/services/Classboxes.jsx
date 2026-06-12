"use client";
import { ChevronRight } from "lucide-react";

const Classboxes = () => {
  const items = [
    {
      title: "Consult An Advocate",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus egestas, risus commodo pretium vulputate, neque mi dapibus mauris, a facilisis neque velit a quam. Etiam non ligula egestas, cursus metus dapibus, pharetra urna. Curabitur tristique lacus et nisl cursus laoreet.",
    },
    {
      title: "Consult A Senior Advocate",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus egestas, risus commodo pretium vulputate, neque mi dapibus mauris, a facilisis neque velit a quam. Etiam non ligula egestas, cursus metus dapibus, pharetra urna. Curabitur tristique lacus et nisl cursus laoreet.",
    },
    {
      title: "Express consultation",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus egestas, risus commodo pretium vulputate, neque mi dapibus mauris, a facilisis neque velit a quam. Etiam non ligula egestas, cursus metus dapibus, pharetra urna. Curabitur tristique lacus et nisl cursus laoreet.",
    },
    {
      title: "Express consultation",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus egestas, risus commodo pretium vulputate, neque mi dapibus mauris, a facilisis neque velit a quam. Etiam non ligula egestas, cursus metus dapibus, pharetra urna. Curabitur tristique lacus et nisl cursus laoreet.",
    },
  ];

  return (
    <section className="w-full bg-beige py-10">
      <div className="w-11/12 mx-auto lg:w-10/12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="
                group
                relative flex flex-col justify-between
                rounded-[18px] bg-white border-2 border-custom-blue
                shadow-[0_8px_18px_rgba(0,0,0,0.12)]
                px-10 py-5 min-h-[350px]
                transition-all duration-200
                hover:bg-[#E3A849] hover:border-[#E3A849]
                hover:scale-105
              "
            >
              <p
                className="
                  font-poppins font-bold text-lg text-custom-blue text-center mb-6
                  transition-colors duration-200
                  group-hover:text-white
                "
              >
                {item.title}
              </p>

              <p
                className="
                  text-sm leading-7 text-gray-700 mb-8 text-justify font-semibold
                  transition-colors duration-200
                  group-hover:text-white
                "
              >
                {item.desc}
              </p>

              <div className="mt-auto flex justify-end">
                <button
                  className="
                    inline-flex items-center justify-between gap-5 px-6 py-1.5
                    rounded-full bg-[#F0B955]
                    shadow-[0_4px_12px_rgba(0,0,0,0.25)]
                    transition-all duration-200 group-hover:bg-white
                  "
                >
                  <span
                    className="
                      font-poppins text-sm font-semibold
                      text-[#1E1E1E]
                      transition-colors duration-200
                      group-hover:text-[#F0B955]
                    "
                  >
                    Book Slot
                  </span>
                  <span
                    className="
                      w-6 h-6 flex items-center justify-center rounded-full
                      bg-[#E3A849] text-white text-xs
                      transition-colors duration-200
                      group-hover:bg-[#F0B955]
                    "
                  >
                    <ChevronRight />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classboxes;

