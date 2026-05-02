export const translateStatus = (status: string | null | undefined): string => {
  if (status === null || status === undefined) {
    return "Статус не знайдено";
  }

  const translations: Record<string, string> = {
    "Inactive": "Неактивний",
    "Activated": "Активований",
    "Knitting Workshop (Waiting for confirmation)": "В'язальний цех (Очікує підтвердження)",
    "Knitting Workshop (Confirmed)": "В'язальний цех (Підтверджено)",
    "Sewing Workshop (In-Progress)": "Зашивальний цех (В процесі)",
    "Sewing Workshop (Finished)": "Зашивальний цех (Завершено)",
    "Turning Workshop (In-Progress)": "Цех вивертання (В процесі)",
    "Turning Workshop (Finished)": "Цех вивертання (Завершено)",
    "Molding Workshop (In-Progress)": "Формувальний цех (В процесі)",
    "Molding Workshop (Finished)": "Формувальний цех (Завершено)",
    "Labeling Workshop (In-Progress)": "Бірковий цех (В процесі)",
    "Labeling Workshop (Finished)": "Бірковий цех (Завершено)",
    "Packaging Workshop (In-Progress)": "Пакувальний цех (В процесі)",
    "Completed": "Завершено",
  };

  return translations[status] ?? "Статус не знайдено";
};
