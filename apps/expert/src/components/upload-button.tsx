"use client";

// Backend removed - uploadthing removed, using mock component
export function UploadButton({ onClientUploadComplete, ...props }) {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = props.accept || "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onClientUploadComplete?.([{ url, name: file.name }]);
      }
    };
    input.click();
  };

  return (
    <button type="button" onClick={handleClick} {...props}>
      {props.children || "Upload"}
    </button>
  );
}