import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useBatches } from "@/hooks/useBatch";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { translateStatus } from "@/utils/translation";

const SECOND_GRADE = [
  { id: 1, label: "Не відповідність лінійним розмірам" },
  { id: 2, label: "Не чистий носок (масло, пух, пил, i т.д)" },
  { id: 3, label: "Не коректний рисунок" },
  { id: 4, label: "Невеликі дірки" },
  { id: 5, label: "Обрив нитки (не значно)" },
];

const SPOILAGE = [
  { id: 6, label: "Сильне відхилення від лінійних розмірів" },
  { id: 7, label: "Дірки, стрілки" },
  { id: 8, label: "Обрив нитки (значно)" },
  { id: 9, label: "Не довязаний виріб" },
];

export function translateBackendError(message?: string): string {
  if (!message) {
    return "Сталася помилка. Спробуйте ще раз.";
  }

  if (message.includes("not found")) {
    return "Партію не знайдено.";
  }

  if (message.includes("terminal status")) {
    return "Партія вже завершена.";
  }

  if (message.includes("not permitted")) {
    return "У вас немає прав для виконання цієї дії.";
  }

  if (message.includes("concurrent packaging batches")) {
    return "Досягнуто ліміту партій на пакуванні.";
  }

  if (message.includes("already working on another batch")) {
    return "У вас уже є активні партії в роботі.";
  }

  if (message.includes("exceed actual size")) {
    return "Кількість браку перевищує кількість виробів.";
  }

  return "Сталася помилка. Спробуйте ще раз.";
}

export const BatchPreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: batch } = useBatches.get(Number(id));
  const { mutate: advance, error: advanceError } = useBatches.advance();
  const { mutate: pack } = useBatches.pack();

  const [defects, setDefects] = useState<Record<number, number>>({});
  const [sizeOverride, setSizeOverride] = useState<number>(0);
  const [remain, setRemain] = useState<number>(0);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (batch?.actualSize) {
      setSizeOverride(batch.actualSize);
    }
  }, [batch?.actualSize]);

  const showQuestionnaire = batch?.status.allowsDefectReporting;
  const showSizeOverride = String(batch?.status.label) === "Activated";
  const isPackagingStep = batch?.status.label === "Packaging Workshop (In-Progress)";
  const isFinish = batch?.status.label?.includes("Finished");
  const isInProgress = batch?.status.label?.includes("In-Progress");

  const handleChange = (id: number, value: string) => {
    setDefects((prev) => ({ ...prev, [id]: Math.max(0, parseInt(value) || 0) }));
  };

  const handleAdvance = () => {
    if (!batch || !id) return;

    const defectsPayload = Object.entries(defects)
      .filter(([, quantity]) => quantity > 0)
      .map(([defect_type_id, quantity]) => ({
        defect_type_id: Number(defect_type_id),
        quantity,
      }));

    if (isPackagingStep) {
      pack(
        { id: Number(id), remain, defects: defectsPayload },
        { onSuccess: () => { setScanned(true); setTimeout(() => navigate("/"), 1000); } },
      );
    } else {
      advance(
        {
          id: Number(id),
          defects: defectsPayload,
          sizeOverride: showSizeOverride ? sizeOverride : batch.actualSize ? batch.actualSize : undefined,
        },
        { onSuccess: () => { setScanned(true); setTimeout(() => navigate("/"), 1000); } },
      );
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {!scanned && (<Card>
            <CardHeader>
              <CardTitle>Інформація про партію</CardTitle>
              <CardDescription>
                {batch && (
                  <div className="border p-4 text-black dark:text-white font-semibold rounded-md shadow-sm space-y-2">
                    <p>{batch.product.name}</p>
                    <p>Розмір: {batch.size}</p>
                    <p>Актуальний Розмір: {batch.actualSize}</p>
                    {/* <p>Статус: {batch.status.label}</p> */}
                    <p>Статус: {translateStatus(batch.status.label)}</p>
                    <p>Назва партії: {batch.name}</p>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showQuestionnaire && (
                <ScrollArea className="h-[40vh] px-4">
                  <div className="pb-8">
                    {isPackagingStep && (
                      <FieldSet>
                        <FieldLegend>Залишок</FieldLegend>
                        <Field className="flex flex-row font-normal text-xl">
                          <FieldLabel>Кількість</FieldLabel>
                          <Input
                            value={remain}
                            onChange={(e) => setRemain(Math.max(0, parseInt(e.target.value) || 0))}
                          />
                        </Field>
                      </FieldSet>
                    )}
                    {showSizeOverride && (
                      <Field className="flex flex-row font-normal texl-xl">
                        <FieldLabel>Актуальна Кількість</FieldLabel>
                        <Input
                          value={sizeOverride}
                          onChange={(e) => setSizeOverride(Number(e.target.value))}
                        />
                      </Field>
                    )}
                  </div>
                  <FieldSet className="flex gap-4">
                    <FieldLegend>Другий сорт</FieldLegend>
                    <FieldGroup className="gap-2">
                      {SECOND_GRADE.map((type) => (
                        <Field key={type.id} className="flex flex-row font-normal">
                          <FieldLabel>{type.label}</FieldLabel>
                          <Input
                            value={defects[type.id] ?? 0}
                            onChange={(e) => handleChange(type.id, e.target.value)}
                          />
                        </Field>
                      ))}
                    </FieldGroup>
                    <FieldGroup className="mt-10 gap-2">
                      <FieldLegend>Брак</FieldLegend>
                      {SPOILAGE.map((type) => (
                        <Field key={type.id} className="flex flex-row font-normal">
                          <FieldLabel>{type.label}</FieldLabel>
                          <Input
                            value={defects[type.id] ?? 0}
                            onChange={(e) => handleChange(type.id, e.target.value)}
                          />
                        </Field>
                      ))}
                    </FieldGroup>
                  </FieldSet>
                </ScrollArea>
              )}
              {advanceError && (
                <div className="mt-2 rounded-md border border-red-500 p-3 text-red-500">
                  {translateBackendError(advanceError.message)}
                </div>
              )}
              <Button
                className="mt-4 w-full"
                onClick={handleAdvance}
                disabled={!id || scanned}
              >
                {isFinish ? "Взяти в роботу" : isInProgress ? "Завершити роботу" : "Сканувати"}
              </Button>
            </CardContent>
          </Card>)}
          {scanned && (
            <Card style={{ borderColor: "#22c55e" }}>
              <CardContent className="p-2 text-center font-semibold text-lg" style={{ color: "#22c55e" }}>
                ✓ Успішно відскановано!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
