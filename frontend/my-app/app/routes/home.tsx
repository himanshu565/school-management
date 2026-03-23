import type { Route } from "./+types/home";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ManagementNav } from "../components/management-nav";

type Student = {
  id: number;
  name: string;
  age: number;
  class_id: number | null;
  section_id: number | null;
};

type StudentForm = {
  name: string;
  age: string;
  class_id: string;
  section_id: string;
};

const emptyForm: StudentForm = {
  name: "",
  age: "",
  class_id: "",
  section_id: "",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Student Dashboard" },
    { name: "description", content: "Manage student records" },
  ];
}

export default function Home() {
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000",
    [],
  );

  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`${apiBaseUrl}/students`);

      if (!response.ok) {
        throw new Error("Could not load students");
      }

      const data = (await response.json()) as Student[];
      setStudents(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStudents();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const toNumberOrNull = (value: string): number | null => {
    if (value.trim() === "") {
      return null;
    }

    return Number(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.age.trim()) {
      setError("Name and age are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        name: form.name.trim(),
        age: Number(form.age),
        class_id: toNumberOrNull(form.class_id),
        section_id: toNumberOrNull(form.section_id),
      };

      const endpoint =
        editingId === null
          ? `${apiBaseUrl}/students`
          : `${apiBaseUrl}/students/${editingId}`;

      const method = editingId === null ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Could not save student");
      }

      resetForm();
      await fetchStudents();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unknown error";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setForm({
      name: student.name,
      age: String(student.age),
      class_id: student.class_id === null ? "" : String(student.class_id),
      section_id: student.section_id === null ? "" : String(student.section_id),
    });
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);

      const response = await fetch(`${apiBaseUrl}/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete student");
      }

      if (editingId === id) {
        resetForm();
      }

      await fetchStudents();
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
          <h1>Student Records</h1>
          <p>View, add, edit, and delete student details from your backend.</p>
        </header>

        <ManagementNav />

        {error ? <div className="sms-alert">{error}</div> : null}

        <section className="sms-card">
          <h2>{editingId === null ? "Add Student" : "Edit Student"}</h2>

          <form className="sms-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Student name"
                required
              />
            </label>

            <label>
              Age
              <input
                name="age"
                type="number"
                min={1}
                value={form.age}
                onChange={handleInputChange}
                placeholder="Age"
                required
              />
            </label>

            <label>
              Class ID
              <input
                name="class_id"
                type="number"
                min={1}
                value={form.class_id}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </label>

            <label>
              Section ID
              <input
                name="section_id"
                type="number"
                min={1}
                value={form.section_id}
                onChange={handleInputChange}
                placeholder="Optional"
              />
            </label>

            <div className="sms-actions">
              <button type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editingId === null
                    ? "Create Student"
                    : "Update Student"}
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
            <h2>All Students</h2>
            <button
              type="button"
              className="ghost"
              onClick={() => void fetchStudents()}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading students...</p>
          ) : students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <div className="sms-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.age}</td>
                      <td>{student.class_id ?? "-"}</td>
                      <td>{student.section_id ?? "-"}</td>
                      <td className="row-actions">
                        <button
                          type="button"
                          className="ghost"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => void handleDelete(student.id)}
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
