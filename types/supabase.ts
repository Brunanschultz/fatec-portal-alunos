export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          auth_id: string
          full_name: string
          email: string
          course: string
          semester: number
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          full_name: string
          email: string
          course: string
          semester: number
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          full_name?: string
          email?: string
          course?: string
          semester?: number
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_skills: {
        Row: {
          id: string
          student_id: string
          skill_name: string
          proficiency_level: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          skill_name: string
          proficiency_level?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          skill_name?: string
          proficiency_level?: string | null
          created_at?: string
        }
      }
      student_hobbies: {
        Row: {
          id: string
          student_id: string
          hobby_name: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          hobby_name: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          hobby_name?: string
          created_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          full_name: string
          email: string | null
          specialization: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email?: string | null
          specialization?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string | null
          specialization?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      disciplines: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          course: string
          semester: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          course: string
          semester: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          course?: string
          semester?: number
          created_at?: string
        }
      }
      forum_topics: {
        Row: {
          id: string
          title: string
          content: string
          student_id: string
          discipline_id: string
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          student_id: string
          discipline_id: string
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          student_id?: string
          discipline_id?: string
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      forum_answers: {
        Row: {
          id: string
          content: string
          student_id: string
          topic_id: string
          is_accepted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          student_id: string
          topic_id: string
          is_accepted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          student_id?: string
          topic_id?: string
          is_accepted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
