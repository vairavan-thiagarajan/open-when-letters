export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          cover_image: string
          theme: string
          edit_token: string
          user_id: string | null
          created_at: string
          updated_at: string
          primary_color: string
          accent_color: string
          font_pair: string
          password_hash: string
          music_url: string
          visibility: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string
          cover_image?: string
          theme?: string
          edit_token: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
          primary_color?: string
          accent_color?: string
          font_pair?: string
          password_hash?: string
          music_url?: string
          visibility?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          cover_image?: string
          theme?: string
          edit_token?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
          primary_color?: string
          accent_color?: string
          font_pair?: string
          password_hash?: string
          music_url?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: 'collections_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
        letters: {
        Row: {
          id: string
          collection_id: string
          title: string
          trigger: string
          body: string
          icon: string
          cover_image: string
          position: number
          created_at: string
          unlock_type: string
          unlock_at: string | null
          memory_image_url: string
          font: string
          background: string
          stickers: unknown
          photos: unknown
          audio_url: string
        }
        Insert: {
          id?: string
          collection_id: string
          title?: string
          trigger?: string
          body?: string
          icon?: string
          cover_image?: string
          position?: number
          created_at?: string
          unlock_type?: string
          unlock_at?: string | null
          memory_image_url?: string
          font?: string
          background?: string
          stickers?: unknown
          photos?: unknown
          audio_url?: string
        }
        Update: {
          id?: string
          collection_id?: string
          title?: string
          trigger?: string
          body?: string
          icon?: string
          cover_image?: string
          position?: number
          created_at?: string
          unlock_type?: string
          unlock_at?: string | null
          memory_image_url?: string
          font?: string
          background?: string
          stickers?: unknown
          photos?: unknown
          audio_url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'letters_collection_id_fkey'
            columns: ['collection_id']
            isOneToOne: false
            referencedRelation: 'collections'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
