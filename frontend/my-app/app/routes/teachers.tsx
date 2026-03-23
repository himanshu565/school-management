import type { Route } from "./+types/teachers";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ManagementNav } from "../components/management-nav";

type Teacher = {
  id: number;
  name: string;
  subject: string;
};

type TeacherForm = {
  name: string;
  subject: string;
};

const emptyForm: TeacherForm = {
  name: "",
  subject: "",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teacher Dashboard" },
    { name: "description", content: "Manage teacher records" },
  ];
}

export default function TeachersPage() {
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000",
    [],
  );

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [form, setForm] = useState<TeacherForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${apiBaseUrl}/teachers`);
      if (!response.ok) {
        throw new Error("Could not load teachers");
      }

      const data = (await response.json()) as Teacher[];
      setTeachers(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTeachers();
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

    if (!form.name.trim() || !form.subject.trim()) {
      setError("Name and subject are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        name: form.name.trim(),
        subject: form.subject.trim(),
      };

      const endpoint =
        editingId === null
          ? `${apiBaseUrl}/teachers`
          : `${apiBaseUrl}/teachers/${editingId}`;

      const method = editingId === null ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Could not save teacher");
      }

      resetForm();
      await fetchTeachers();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setForm({
      name: teacher.name,
      subject: teacher.subject,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);

      const response = await fetch(`${apiBaseUrl}/teachers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete teacher");
      }

      if (editingId === id) {
        resetForm();
      }

      await fetchTeachers();
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
          <h1>Teacher Records</h1>
          <p>View, add, edit, and delete teacher details from your backend.</p>
        </header>

        <ManagementNav />

        {error ? <div className="sms-alert">{error}</div> : null}

        <section className="sms-card">
          <h2>{editingId === null ? "Add Teacher" : "Edit Teacher"}</h2>

          <form className="sms-form sms-form-2" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Teacher name"
                required
              />
            </label>

            <label>
              Subject
              <input
                name="subject"
                value={form.subject}
                onChange={handleInputChange}
                placeholder="Subject taught"
                required
              />
            </label>

            <div className="sms-actions">
              <button type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editingId === null
                    ? "Create Teacher"
                    : "Update Teacher"}
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
            <h2>All Teachers</h2>
            <button type="button" className="ghost" onClick={() => void fetchTeachers()}>
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading teachers...</p>
          ) : teachers.length === 0 ? (
            <p>No teachers found.</p>
          ) : (
            <div className="sms-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.id}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.subject}</td>
                      <td className="row-actions">
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => handleEdit(teacher)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => void handleDelete(teacher.id)}
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
