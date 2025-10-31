import { Star } from "lucide-react";
import { memo } from "react";

const testimonials = [
  {
    id: 1,
    name: "Yaxshimuratov Yaxshimurod",
    rating: 5,
    comment:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    highlighted: true,
  },
  {
    id: 2,
    name: "Yaxshimuratov Yaxshimurod",
    rating: 5,
    comment:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    highlighted: false,
  },
  {
    id: 3,
    name: "Yaxshimuratov Yaxshimurod",
    rating: 5,
    comment:
      "I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.",
    highlighted: false,
  },
];

const Comment = () => {
  return (
    <div>
      <div className="">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="border rounded-[16px] mb-[20px] p-[16px]"
          >
            <div className="mb-3">
              <p className="text-sm text-gray-400">Ism Familiya:</p>
              <h3 className="text-lg font-semibold text-white">
                {testimonial.name}
              </h3>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-400">Reyting:</p>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Komentariya:</p>
              <p className="text-gray-300 leading-relaxed">
                {testimonial.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Comment);
