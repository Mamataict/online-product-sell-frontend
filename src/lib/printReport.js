const ua = () => (typeof navigator !== "undefined" ? navigator.userAgent : "");

const isMobile = () =>
  /Android|iPhone|iPad|iPod/i.test(ua()) ||
  (/Macintosh/i.test(ua()) && navigator.maxTouchPoints > 1); // iPadOS

const isSafari = () => /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua());

// Hidden-iframe printing only works reliably here
const canIframePrint = () => !isMobile() && !isSafari();

let frame = null;
let blobUrl = null;

export const cleanupPrint = () => {
  if (frame?.parentNode) frame.parentNode.removeChild(frame);
  if (blobUrl) URL.revokeObjectURL(blobUrl);
  frame = null;
  blobUrl = null;
};

const download = (url, filename) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export async function printReport({ path, params = {}, token, filename = "report.pdf" }) {
  cleanupPrint();

  const desktop = canIframePrint();
  // Must happen before any await, or mobile popup blockers will stop it
  const win = desktop ? null : window.open("", "_blank");

  try {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, v ?? ""])),
    );

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json, application/pdf",
      },
    });

    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      try { msg = (await res.json()).message || msg; } catch {}
      throw new Error(msg);
    }

    const data = await res.blob();
    if (data.type && !data.type.includes("pdf")) throw new Error("Server did not return a PDF");

    const url = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
    blobUrl = url;

    if (desktop) {
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:fixed;left:-10000px;top:0;width:900px;height:1200px;border:0;";
      frame = iframe;

      let done = false;
      iframe.onload = () => {
        if (done) return;
        done = true;
        setTimeout(() => {
          try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          } catch {
            download(url, filename);
          }
        }, 300);
      };
      iframe.src = url;
      document.body.appendChild(iframe);
    } else if (win && !win.closed) {
      win.location.href = url; // browser's own PDF viewer handles print/share
    } else {
      download(url, filename); // popup blocked
    }
  } catch (err) {
    if (win && !win.closed) win.close();
    throw err;
  }
}