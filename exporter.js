/**
 * Exporter Module: Standalone HTML Downloader, JSON Importer/Exporter, PDF/Print
 */

const PortfolioExporter = {
  downloadHTML(data) {
    try {
      const fullHtml = PortfolioTemplates.render(data);
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const safeName = (data.personal.name || 'my-portfolio')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
      
      const fileName = `${safeName}-portfolio.html`;
      this.triggerDownload(blob, fileName);
      return { success: true, fileName };
    } catch (err) {
      console.error('Error generating HTML download:', err);
      return { success: false, error: err.message };
    }
  },

  downloadJSON(data) {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const safeName = (data.personal.name || 'portfolio-backup')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      
      const fileName = `${safeName}-data.json`;
      this.triggerDownload(blob, fileName);
      return { success: true, fileName };
    } catch (err) {
      console.error('Error exporting JSON:', err);
      return { success: false, error: err.message };
    }
  },

  importJSON(file, callback) {
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.personal || !parsed.theme) {
          throw new Error('Invalid portfolio file format.');
        }
        callback(null, parsed);
      } catch (err) {
        callback(err, null);
      }
    };

    reader.onerror = () => {
      callback(new Error('Failed to read file.'), null);
    };

    reader.readAsText(file);
  },

  async copyHTMLToClipboard(data) {
    try {
      const fullHtml = PortfolioTemplates.render(data);
      await navigator.clipboard.writeText(fullHtml);
      return true;
    } catch (err) {
      console.error('Failed to copy HTML:', err);
      return false;
    }
  },

  printPreview(previewIframe) {
    try {
      if (previewIframe && previewIframe.contentWindow) {
        previewIframe.contentWindow.focus();
        previewIframe.contentWindow.print();
      } else {
        window.print();
      }
    } catch (err) {
      console.error('Failed to trigger print dialog:', err);
    }
  },

  triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};