// components/teachers/teachers.tsx
import { Teacher } from './teacher-type'  // Supondo que você tenha um tipo específico de Teacher

type TeacherListProps = {
  teachers: Teacher[]
}

export function TeacherList({ teachers }: TeacherListProps) {
  return (
    <div>
      {teachers.map((teacher) => (
        <div key={teacher.id} className="mb-8 border rounded p-4 shadow-sm">
          <h2 className="text-xl font-semibold">{teacher.full_name}</h2>
          <p className="text-muted-foreground mb-2">{teacher.specialization}</p>
          <p className="mb-4">{teacher.bio}</p>
        </div>
      ))}
    </div>
  )
}
