import React from "react";
import { fieldConfig } from "../../../utils/fieldConfig";

const MemberFields = ({ member, isMessageExpanded, setIsMessageExpanded }) => {
  const fields = fieldConfig.map(
    ({ key, label, transform, default: defaultValue, isLong }) => {
      const value = transform
        ? transform(member[key])
        : member[key] || defaultValue;
      return { key, label, value, isLong: isLong || false };
    }
  );

  return (
    <div className="grid gap-1 grid-cols-2">
      {fields.map(({ key, label, value, isLong }) => (
        <div
          key={key}
          className={`p-2 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200 ${
            isLong ? "col-span-2" : ""
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 text-sm">{label}:</span>
            {isLong && (
              <button
                onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
              >
                {isMessageExpanded ? "Less" : "More"}
              </button>
            )}
          </div>
          <span
            className={`mt-0.5 text-gray-600 text-sm ${
              isLong
                ? isMessageExpanded
                  ? "line-clamp-none"
                  : "line-clamp-1"
                : ""
            }`}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MemberFields;
