// CSV Export utility

interface ExportColumn<T> {
  header: string;
  accessor: (item: T) => string | number;
}

export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string
): void {
  // Build CSV content
  const headers = columns.map((col) => col.header).join(',');
  const rows = data.map((item) =>
    columns
      .map((col) => {
        const value = col.accessor(item);
        // Escape values that contain commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',')
  );

  const csvContent = [headers, ...rows].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Predefined export configurations
export const clientExportColumns = [
  { header: 'First Name', accessor: (c: { first_name: string }) => c.first_name },
  { header: 'Last Name', accessor: (c: { last_name: string }) => c.last_name },
  { header: 'Email', accessor: (c: { email: string }) => c.email },
  { header: 'Phone', accessor: (c: { phone: string }) => c.phone },
  { header: 'Total Visits', accessor: (c: { appointments: unknown[] }) => c.appointments.length },
  { header: 'Total Spent', accessor: (c: { totalSpent: number }) => c.totalSpent },
  { header: 'Pets', accessor: (c: { pets: { name: string }[] }) => c.pets.map((p) => p.name).join('; ') },
  { header: 'Notes', accessor: (c: { notes?: string }) => c.notes || '' },
];

export const appointmentExportColumns = [
  { header: 'Date', accessor: (a: { start_time: string }) => new Date(a.start_time).toLocaleDateString() },
  { header: 'Time', accessor: (a: { start_time: string }) => new Date(a.start_time).toLocaleTimeString() },
  { header: 'Client', accessor: (a: { client: { first_name: string; last_name: string } }) => `${a.client.first_name} ${a.client.last_name}` },
  { header: 'Pet', accessor: (a: { pet: { name: string } }) => a.pet.name },
  { header: 'Service', accessor: (a: { service: { name: string } }) => a.service.name },
  { header: 'Status', accessor: (a: { status: string }) => a.status },
  { header: 'Price', accessor: (a: { total_price: number }) => a.total_price },
];
