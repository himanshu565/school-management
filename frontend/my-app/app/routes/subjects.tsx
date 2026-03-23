import type { Route } from "./+types/subjects";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ManagementNav } from "../components/management-nav";

type Subject = {
  id: number;
  name: string;
};

type SubjectForm = {
  name: string;
};

const emptyForm: SubjectForm = {
  name: "",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Subject Dashboard" },
    { name: "description", content: "Manage subject records" },
  ];
}

export default function SubjectsPage() {
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000",
    [],
  );

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState<SubjectForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${apiBaseUrl}/subjects`);
      if (!response.ok) {
        throw new Error("Could not load subjects");
      }

      const data = (await response.json()) as Subject[];
      setSubjects(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSubjects();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        name: form.name.trim(),
      };

      const endpoint =
        editingId === null
          ? `${apiBaseUrl}/subjects`
          : `${apiBaseUrl}/subjects/${editingId}`;

      const method = editingId === null ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Could not save subject");
      }

      resetForm();
      await fetchSubjects();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setForm({
      name: subject.name,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);

      const response = await fetch(`${apiBaseUrl}/subjects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete subject");
      }

      if (editingId === id) {
        resetForm();
      }

      await fetchSubjects();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Unknown error";
      setError(message);
    }
  };

  return (
    <main className="sms-page">
      <section className="sms-shell">
        <header className="sms-header">
          <p className="sms-kicker">School Management</p>
          <h1>Subject Records</h1>
          <p>View, add, edit, and delete subject details from your backend.</p>
        </header>

        <ManagementNav />

        {error ? <div className="sms-alert">{error}</div> : null}

        <section className="sms-card">
          <h2>{editingId === null ? "Add Subject" : "Edit Subject"}</h2>

          <form className="sms-form sms-form-1" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Subject name"
                required
              />
            </label>

            <div className="sms-actions">
              <button type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editingId === null
                    ? "Create Subject"
                    : "Update Subject"}
              </button>

              {editingId !== null ? (
                <button type="button" className="ghost" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="sms-card">
          <div className="sms-list-header">
            <h2>All Subjects</h2>
            <button type="button" className="ghost" onClick={() => void fetchSubjects()}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading subjects...</p>
          ) : subjects.length === 0 ? (
            <p>No subjects found.</p>
          ) : (
            <div className="sms-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>{subject.id}</td>
                      <td>{subject.name}</td>
                      <td className="row-actions">
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => handleEdit(subject)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => void handleDelete(subject.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
