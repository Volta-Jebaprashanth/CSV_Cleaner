/* script.js */
document.getElementById('cleanButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a CSV file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const csvContent = event.target.result;

        const removeHtmlTags = (text) => {
            let cleanText = text.replace(/<[^>]*>/g, '');
            cleanText = cleanText.replace(/&[a-z]+;/gi, ' ');
            return cleanText.trim();
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            if (isNaN(date)) return dateString;
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = date.toLocaleString('en-US', { month: 'short' });
            const year = date.getUTCFullYear();
            return `${day}-${month}-${year}`;
        };

        const rows = csvContent.split(/\r\n|\n|\r/).map(row => {
            return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        });

        const cleanedRows = rows.map(row => 
            row.map(cell => {
                cell = removeHtmlTags(cell);
                return /\b[A-Za-z]{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT/.test(cell) ? formatDate(cell) : cell;
            })
        );

        const cleanedCsvContent = cleanedRows.map(row => row.join(',')).join('\n');

        const blob = new Blob([cleanedCsvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        const cleanedFileName = file.name.replace('.csv', '') + '_cleaned.csv';
        a.href = url;
        a.download = cleanedFileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    reader.readAsText(file);
});
