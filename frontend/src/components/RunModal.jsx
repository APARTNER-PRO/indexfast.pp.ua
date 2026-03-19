// src/components/RunModal.jsx
import { useState, useEffect, memo } from "react";
import { Modal, Field, Input, Btn, ProgressBar, JobProgress } from "./ui/index.jsx";
import { useRunIndex } from "../hooks/useStats.js";
import { useJobPoller } from "../hooks/useJobPoller.js";
import { C } from "../constants.js";

export const RunModal = memo(function RunModal({ open, onClose, onFinished, site, remaining }) {
  const [count, setCount]   = useState("");
  const [jobId, setJobId]   = useState(null);
  const [error, setError]   = useState("");

  const runIndex = useRunIndex();
  const { job, isPolling }  = useJobPoller(jobId, {
    onFinished: (j) => { onFinished?.(j); },
  });

  useEffect(() => {
    if (open) { setCount(String(remaining || 0)); setError(""); setJobId(null); }
  }, [open, remaining]);

  async function submit() {
    setError("");
    const n = parseInt(count);
    if (!n || n < 1)       return setError("Введіть кількість URL (мінімум 1)");
    if (n > remaining)     return setError(`Максимум ${remaining} URL залишилось сьогодні`);

    try {
      const data = await runIndex.mutateAsync({ site_id: site.id, count: n });
      setJobId(data?.job_id ?? null);
    } catch (e) {
      setError(e.message);
    }
  }

  const isJobActive = jobId && isPolling;
  const isJobDone   = job && (job.status === "done" || job.status === "failed");

  return (
    <Modal open={open} onClose={onClose}
      title={jobId ? "Індексація запущена" : "Запустити індексацію"}
      subtitle={site ? `Сайт: ${site.domain}` : ""}>

      {/* Прогрес активного job */}
      {jobId && <JobProgress job={job} isPolling={isPolling}/>}

      {remaining === 0 && !jobId ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
          <p style={{ color: C.muted }}>Денний ліміт вичерпано.<br/>Ліміт оновиться завтра о 00:00.</p>
          <Btn variant="ghost" onClick={onClose} style={{ marginTop: 16 }}>Закрити</Btn>
        </div>
      ) : !jobId ? (
        <>
          <div style={{ background: C.dark, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: C.muted }}>Залишилось сьогодні</span>
              <span style={{ color: C.green, fontWeight: 700 }}>{remaining} URL</span>
            </div>
            <ProgressBar value={remaining} max={remaining} color={C.green}/>
          </div>

          <Field label="Кількість URL для відправки">
            <Input
              type="number"
              value={count}
              onChange={e => setCount(e.target.value)}
              min={1}
              max={remaining}
            />
          </Field>

          {error && (
            <p style={{ color: C.red, fontSize: 13, padding: "10px 14px",
              background: "rgba(255,77,109,0.07)", borderRadius: 10, marginBottom: 12 }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Скасувати</Btn>
            <Btn variant="primary" loading={runIndex.isPending} onClick={submit} style={{ flex: 2 }}>
              ▶ Запустити
            </Btn>
          </div>
        </>
      ) : (
        // Job запущено — показуємо тільки прогрес і кнопку закрити
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <Btn
            variant={isJobDone ? "primary" : "ghost"}
            onClick={onClose}
            style={{ flex: 1 }}>
            {isJobDone ? "Готово ✓" : "Закрити (продовжується у фоні)"}
          </Btn>
        </div>
      )}
    </Modal>
  );
});
