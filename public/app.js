const form = document.getElementById("uploadForm");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  result.textContent = "Uploading...";

  const response = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  result.textContent = JSON.stringify(data, null, 2);
});
