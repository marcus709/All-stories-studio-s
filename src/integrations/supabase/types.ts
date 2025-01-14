export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          condition_type: string
          condition_value: number
          description: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          condition_type: string
          condition_value: number
          description: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          condition_type?: string
          condition_value?: number
          description?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      ai_configurations: {
        Row: {
          character_rules: string[] | null
          created_at: string | null
          creativity_level: number | null
          custom_prompt: string | null
          feedback_cycle: string | null
          feedback_format: string | null
          focus_area: string | null
          genre: string | null
          id: string
          keywords_avoid: string[] | null
          keywords_include: string[] | null
          max_tokens: number
          model_type: Database["public"]["Enums"]["ai_model_type"]
          name: string
          plot_rules: string[] | null
          point_of_view: string | null
          response_style: string | null
          suggestion_complexity: string | null
          system_prompt: string | null
          temperature: number
          tone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          character_rules?: string[] | null
          created_at?: string | null
          creativity_level?: number | null
          custom_prompt?: string | null
          feedback_cycle?: string | null
          feedback_format?: string | null
          focus_area?: string | null
          genre?: string | null
          id?: string
          keywords_avoid?: string[] | null
          keywords_include?: string[] | null
          max_tokens?: number
          model_type?: Database["public"]["Enums"]["ai_model_type"]
          name: string
          plot_rules?: string[] | null
          point_of_view?: string | null
          response_style?: string | null
          suggestion_complexity?: string | null
          system_prompt?: string | null
          temperature?: number
          tone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          character_rules?: string[] | null
          created_at?: string | null
          creativity_level?: number | null
          custom_prompt?: string | null
          feedback_cycle?: string | null
          feedback_format?: string | null
          focus_area?: string | null
          genre?: string | null
          id?: string
          keywords_avoid?: string[] | null
          keywords_include?: string[] | null
          max_tokens?: number
          model_type?: Database["public"]["Enums"]["ai_model_type"]
          name?: string
          plot_rules?: string[] | null
          point_of_view?: string | null
          response_style?: string | null
          suggestion_complexity?: string | null
          system_prompt?: string | null
          temperature?: number
          tone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      backwards_planning_milestones: {
        Row: {
          character_impacts: Json | null
          created_at: string | null
          description: string
          id: string
          milestone_type: Database["public"]["Enums"]["milestone_type"]
          position: number
          story_id: string
          theme_connections: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          character_impacts?: Json | null
          created_at?: string | null
          description: string
          id?: string
          milestone_type: Database["public"]["Enums"]["milestone_type"]
          position: number
          story_id: string
          theme_connections?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          character_impacts?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          milestone_type?: Database["public"]["Enums"]["milestone_type"]
          position?: number
          story_id?: string
          theme_connections?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backwards_planning_milestones_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      backwards_story_endings: {
        Row: {
          achievements: string
          character_outcomes: string
          created_at: string | null
          final_scene: string
          id: string
          key_themes: string[]
          resolution: string
          story_id: string
          updated_at: string | null
        }
        Insert: {
          achievements: string
          character_outcomes: string
          created_at?: string | null
          final_scene: string
          id?: string
          key_themes?: string[]
          resolution: string
          story_id: string
          updated_at?: string | null
        }
        Update: {
          achievements?: string
          character_outcomes?: string
          created_at?: string | null
          final_scene?: string
          id?: string
          key_themes?: string[]
          resolution?: string
          story_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "backwards_story_endings_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_submissions: {
        Row: {
          challenge_id: string | null
          content: string
          feedback: string | null
          id: string
          score: number | null
          submitted_at: string | null
          user_id: string | null
          viewed: boolean | null
          word_count: number | null
        }
        Insert: {
          challenge_id?: string | null
          content: string
          feedback?: string | null
          id?: string
          score?: number | null
          submitted_at?: string | null
          user_id?: string | null
          viewed?: boolean | null
          word_count?: number | null
        }
        Update: {
          challenge_id?: string | null
          content?: string
          feedback?: string | null
          id?: string
          score?: number | null
          submitted_at?: string | null
          user_id?: string | null
          viewed?: boolean | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      character_arc_points: {
        Row: {
          character_id: string
          conflicts: string[] | null
          created_at: string | null
          decisions: string[] | null
          emotional_state: string
          goals: string[] | null
          id: string
          milestone_id: string | null
          story_id: string
          updated_at: string | null
        }
        Insert: {
          character_id: string
          conflicts?: string[] | null
          created_at?: string | null
          decisions?: string[] | null
          emotional_state: string
          goals?: string[] | null
          id?: string
          milestone_id?: string | null
          story_id: string
          updated_at?: string | null
        }
        Update: {
          character_id?: string
          conflicts?: string[] | null
          created_at?: string | null
          decisions?: string[] | null
          emotional_state?: string
          goals?: string[] | null
          id?: string
          milestone_id?: string | null
          story_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_arc_points_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_arc_points_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "backwards_planning_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_arc_points_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      character_relationships: {
        Row: {
          character1_id: string
          character2_id: string
          created_at: string | null
          description: string | null
          id: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          story_id: string
          strength: number | null
          updated_at: string | null
        }
        Insert: {
          character1_id: string
          character2_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          story_id: string
          strength?: number | null
          updated_at?: string | null
        }
        Update: {
          character1_id?: string
          character2_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          relationship_type?: Database["public"]["Enums"]["relationship_type"]
          story_id?: string
          strength?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_relationships_character1_id_fkey"
            columns: ["character1_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_relationships_character2_id_fkey"
            columns: ["character2_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_relationships_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      character_shares: {
        Row: {
          character_id: string
          created_at: string | null
          id: string
          shared_by: string
          shared_with_group: string | null
          shared_with_user: string | null
        }
        Insert: {
          character_id: string
          created_at?: string | null
          id?: string
          shared_by: string
          shared_with_group?: string | null
          shared_with_user?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string | null
          id?: string
          shared_by?: string
          shared_with_group?: string | null
          shared_with_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_shares_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_shares_shared_with_group_fkey"
            columns: ["shared_with_group"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          ancestry: string | null
          archetype: string | null
          backstory: string | null
          behavioral_quirks: string[] | null
          body_language: string | null
          core_beliefs: string[] | null
          created_at: string | null
          cultural_background: Json | null
          dialogue_style: Json | null
          expertise: Json | null
          external_goals: string[] | null
          flaws: string[] | null
          goals: string | null
          group_roles: string[] | null
          iconic_phrases: string[] | null
          id: string
          internal_motivations: string[] | null
          life_events: Json | null
          linguistic_traits: Json | null
          name: string
          psychological_traits: Json | null
          psychology: Json | null
          role: string | null
          skill_trees: Json | null
          skills: Json | null
          social_masks: Json | null
          story_id: string | null
          training_history: string[] | null
          traits: string[] | null
          updated_at: string | null
          user_id: string
          values_and_morals: Json | null
        }
        Insert: {
          ancestry?: string | null
          archetype?: string | null
          backstory?: string | null
          behavioral_quirks?: string[] | null
          body_language?: string | null
          core_beliefs?: string[] | null
          created_at?: string | null
          cultural_background?: Json | null
          dialogue_style?: Json | null
          expertise?: Json | null
          external_goals?: string[] | null
          flaws?: string[] | null
          goals?: string | null
          group_roles?: string[] | null
          iconic_phrases?: string[] | null
          id?: string
          internal_motivations?: string[] | null
          life_events?: Json | null
          linguistic_traits?: Json | null
          name: string
          psychological_traits?: Json | null
          psychology?: Json | null
          role?: string | null
          skill_trees?: Json | null
          skills?: Json | null
          social_masks?: Json | null
          story_id?: string | null
          training_history?: string[] | null
          traits?: string[] | null
          updated_at?: string | null
          user_id: string
          values_and_morals?: Json | null
        }
        Update: {
          ancestry?: string | null
          archetype?: string | null
          backstory?: string | null
          behavioral_quirks?: string[] | null
          body_language?: string | null
          core_beliefs?: string[] | null
          created_at?: string | null
          cultural_background?: Json | null
          dialogue_style?: Json | null
          expertise?: Json | null
          external_goals?: string[] | null
          flaws?: string[] | null
          goals?: string | null
          group_roles?: string[] | null
          iconic_phrases?: string[] | null
          id?: string
          internal_motivations?: string[] | null
          life_events?: Json | null
          linguistic_traits?: Json | null
          name?: string
          psychological_traits?: Json | null
          psychology?: Json | null
          role?: string | null
          skill_trees?: Json | null
          skills?: Json | null
          social_masks?: Json | null
          story_id?: string | null
          training_history?: string[] | null
          traits?: string[] | null
          updated_at?: string | null
          user_id?: string
          values_and_morals?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "characters_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_challenges: {
        Row: {
          active_date: string
          created_at: string | null
          description: string
          difficulty: Database["public"]["Enums"]["challenge_difficulty"]
          id: string
          prompt: string
          tips: string[] | null
          title: string
          word_count_goal: number | null
        }
        Insert: {
          active_date: string
          created_at?: string | null
          description: string
          difficulty?: Database["public"]["Enums"]["challenge_difficulty"]
          id?: string
          prompt: string
          tips?: string[] | null
          title: string
          word_count_goal?: number | null
        }
        Update: {
          active_date?: string
          created_at?: string | null
          description?: string
          difficulty?: Database["public"]["Enums"]["challenge_difficulty"]
          id?: string
          prompt?: string
          tips?: string[] | null
          title?: string
          word_count_goal?: number | null
        }
        Relationships: []
      }
      document_references: {
        Row: {
          created_at: string | null
          document_id: string
          id: string
          reference_id: string
          reference_type: string
          section_id: string
        }
        Insert: {
          created_at?: string | null
          document_id: string
          id?: string
          reference_id: string
          reference_type: string
          section_id: string
        }
        Update: {
          created_at?: string | null
          document_id?: string
          id?: string
          reference_id?: string
          reference_type?: string
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_references_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_references_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "document_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      document_sections: {
        Row: {
          content: string | null
          created_at: string | null
          document_id: string
          id: string
          order_index: number
          title: string
          type: Database["public"]["Enums"]["document_section_type"]
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          document_id: string
          id?: string
          order_index: number
          title: string
          type: Database["public"]["Enums"]["document_section_type"]
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          document_id?: string
          id?: string
          order_index?: number
          title?: string
          type?: Database["public"]["Enums"]["document_section_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_sections_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_shares: {
        Row: {
          can_edit: boolean | null
          created_at: string | null
          document_id: string
          id: string
          shared_by: string
          shared_with_group: string | null
          shared_with_user: string | null
        }
        Insert: {
          can_edit?: boolean | null
          created_at?: string | null
          document_id: string
          id?: string
          shared_by: string
          shared_with_group?: string | null
          shared_with_user?: string | null
        }
        Update: {
          can_edit?: boolean | null
          created_at?: string | null
          document_id?: string
          id?: string
          shared_by?: string
          shared_with_group?: string | null
          shared_with_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_shares_shared_with_group_fkey"
            columns: ["shared_with_group"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string
          created_at: string | null
          id: string
          story_id: string
          time_period: string | null
          time_period_details: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string | null
          id?: string
          story_id: string
          time_period?: string | null
          time_period_details?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          story_id?: string
          time_period?: string | null
          time_period_details?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey_profiles"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_progress: {
        Row: {
          created_at: string | null
          date: string
          goal_id: string
          id: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          date?: string
          goal_id: string
          id?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          date?: string
          goal_id?: string
          id?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "goal_progress_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "user_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      group_goal_progress: {
        Row: {
          created_at: string | null
          date: string
          goal_id: string
          group_id: string
          id: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          date?: string
          goal_id: string
          group_id: string
          id?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          date?: string
          goal_id?: string
          group_id?: string
          id?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_goal_progress_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "group_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_goal_progress_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_goal_progress_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_goals: {
        Row: {
          created_at: string | null
          created_by: string
          frequency: Database["public"]["Enums"]["goal_frequency"]
          goal_type: Database["public"]["Enums"]["goal_type"]
          group_id: string
          id: string
          start_date: string
          target_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          frequency: Database["public"]["Enums"]["goal_frequency"]
          goal_type: Database["public"]["Enums"]["goal_type"]
          group_id: string
          id?: string
          start_date?: string
          target_value: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          frequency?: Database["public"]["Enums"]["goal_frequency"]
          goal_type?: Database["public"]["Enums"]["goal_type"]
          group_id?: string
          id?: string
          start_date?: string
          target_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_goals_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_join_requests: {
        Row: {
          created_at: string | null
          editing_rights_on_accept: boolean | null
          group_id: string | null
          id: string
          invitation_status: string | null
          invited_by: string | null
          message: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          editing_rights_on_accept?: boolean | null
          group_id?: string | null
          id?: string
          invitation_status?: string | null
          invited_by?: string | null
          message?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          editing_rights_on_accept?: boolean | null
          group_id?: string | null
          id?: string
          invitation_status?: string | null
          invited_by?: string | null
          message?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_join_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_join_requests_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          created_at: string | null
          editing_rights: boolean | null
          group_id: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          editing_rights?: boolean | null
          group_id?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          editing_rights?: boolean | null
          group_id?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string | null
          group_id: string | null
          id: string
          metadata: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          group_type: Database["public"]["Enums"]["group_type"]
          id: string
          image_url: string | null
          name: string
          privacy: Database["public"]["Enums"]["group_privacy"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          group_type?: Database["public"]["Enums"]["group_type"]
          id?: string
          image_url?: string | null
          name: string
          privacy?: Database["public"]["Enums"]["group_privacy"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          group_type?: Database["public"]["Enums"]["group_type"]
          id?: string
          image_url?: string | null
          name?: string
          privacy?: Database["public"]["Enums"]["group_privacy"]
          updated_at?: string | null
        }
        Relationships: []
      }
      invitation_links: {
        Row: {
          created_at: string | null
          created_by: string
          expires_at: string | null
          group_id: string | null
          id: string
          type: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          expires_at?: string | null
          group_id?: string | null
          id?: string
          type: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          expires_at?: string | null
          group_id?: string | null
          id?: string
          type?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_links_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      plot_emotions: {
        Row: {
          analysis_text: string | null
          character_emotion: string | null
          created_at: string | null
          document_id: string | null
          id: string
          intensity: number | null
          plot_event_id: string | null
          reader_emotion: string | null
          updated_at: string | null
        }
        Insert: {
          analysis_text?: string | null
          character_emotion?: string | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          intensity?: number | null
          plot_event_id?: string | null
          reader_emotion?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis_text?: string | null
          character_emotion?: string | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          intensity?: number | null
          plot_event_id?: string | null
          reader_emotion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plot_emotions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plot_emotions_plot_event_id_fkey"
            columns: ["plot_event_id"]
            isOneToOne: false
            referencedRelation: "plot_events"
            referencedColumns: ["id"]
          },
        ]
      }
      plot_events: {
        Row: {
          created_at: string | null
          description: string | null
          document_section_id: string | null
          id: string
          order_index: number
          stage: string
          story_id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          document_section_id?: string | null
          id?: string
          order_index: number
          stage: string
          story_id: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          document_section_id?: string | null
          id?: string
          order_index?: number
          stage?: string
          story_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plot_events_document_section_id_fkey"
            columns: ["document_section_id"]
            isOneToOne: false
            referencedRelation: "document_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plot_events_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      plot_structures: {
        Row: {
          id: string
          name: string
          stages: string[]
        }
        Insert: {
          id?: string
          name: string
          stages: string[]
        }
        Update: {
          id?: string
          name?: string
          stages?: string[]
        }
        Relationships: []
      }
      plot_template_instances: {
        Row: {
          created_at: string | null
          id: string
          name: string
          story_id: string
          template_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          story_id: string
          template_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          story_id?: string
          template_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plot_template_instances_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      private_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          receiver_id: string
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          receiver_id: string
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          receiver_id?: string
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_receiver_id_fkey_profiles"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_messages_sender_id_fkey_profiles"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          background_url: string | null
          bio: string | null
          genres: string[] | null
          id: string
          pinned_work: Json | null
          skills: string[] | null
          social_links: Json | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          background_url?: string | null
          bio?: string | null
          genres?: string[] | null
          id: string
          pinned_work?: Json | null
          skills?: string[] | null
          social_links?: Json | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          background_url?: string | null
          bio?: string | null
          genres?: string[] | null
          id?: string
          pinned_work?: Json | null
          skills?: string[] | null
          social_links?: Json | null
          username?: string | null
        }
        Relationships: []
      }
      saved_posts: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      selected_achievements: {
        Row: {
          achievement_id: string | null
          id: string
          slot_number: number
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          id?: string
          slot_number: number
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          id?: string
          slot_number?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "selected_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_shared_space: boolean | null
          privacy: string
          shared_group_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared_space?: boolean | null
          privacy?: string
          shared_group_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared_space?: boolean | null
          privacy?: string
          shared_group_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_shared_group_id_fkey"
            columns: ["shared_group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      story_analysis: {
        Row: {
          created_at: string | null
          id: string
          story_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          story_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          story_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_analysis_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_ideas: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          story_id: string
          tag: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          story_id: string
          tag?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          story_id?: string
          tag?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_ideas_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_issues: {
        Row: {
          analysis_id: string
          created_at: string | null
          description: string
          id: string
          issue_type: Database["public"]["Enums"]["story_issue_type"]
          location: string | null
          severity: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          analysis_id: string
          created_at?: string | null
          description: string
          id?: string
          issue_type: Database["public"]["Enums"]["story_issue_type"]
          location?: string | null
          severity?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          analysis_id?: string
          created_at?: string | null
          description?: string
          id?: string
          issue_type?: Database["public"]["Enums"]["story_issue_type"]
          location?: string | null
          severity?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_issues_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "story_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      story_planning_steps: {
        Row: {
          created_at: string | null
          description: string
          id: string
          step_number: number
          story_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          step_number: number
          story_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          step_number?: number
          story_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_planning_steps_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_shares: {
        Row: {
          created_at: string | null
          id: string
          shared_by: string | null
          shared_with_group: string | null
          shared_with_user: string | null
          story_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          shared_by?: string | null
          shared_with_group?: string | null
          shared_with_user?: string | null
          story_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          shared_by?: string | null
          shared_with_group?: string | null
          shared_with_user?: string | null
          story_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_shares_shared_with_group_fkey"
            columns: ["shared_with_group"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_shares_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_character_positions: {
        Row: {
          character_id: string
          created_at: string | null
          id: string
          position: number
          timeline_event_id: string
          updated_at: string | null
        }
        Insert: {
          character_id: string
          created_at?: string | null
          id?: string
          position: number
          timeline_event_id: string
          updated_at?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string | null
          id?: string
          position?: number
          timeline_event_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_character_positions_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_character_positions_timeline_event_id_fkey"
            columns: ["timeline_event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          position: number
          story_id: string
          title: string
          updated_at: string | null
          year: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          position: number
          story_id: string
          title: string
          updated_at?: string | null
          year?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          position?: number
          story_id?: string
          title?: string
          updated_at?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_tension_points: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          position: number
          story_id: string
          tension_level: number
          type: Database["public"]["Enums"]["tension_point_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          position: number
          story_id: string
          tension_level: number
          type?: Database["public"]["Enums"]["tension_point_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          position?: number
          story_id?: string
          tension_level?: number
          type?: Database["public"]["Enums"]["tension_point_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_tension_points_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          privacy: Database["public"]["Enums"]["topic_privacy"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          privacy?: Database["public"]["Enums"]["topic_privacy"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          privacy?: Database["public"]["Enums"]["topic_privacy"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          id: string
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string | null
          frequency: Database["public"]["Enums"]["goal_frequency"]
          goal_type: Database["public"]["Enums"]["goal_type"]
          id: string
          start_date: string
          target_value: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          frequency: Database["public"]["Enums"]["goal_frequency"]
          goal_type: Database["public"]["Enums"]["goal_type"]
          id?: string
          start_date?: string
          target_value: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          frequency?: Database["public"]["Enums"]["goal_frequency"]
          goal_type?: Database["public"]["Enums"]["goal_type"]
          id?: string
          start_date?: string
          target_value?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_trials: {
        Row: {
          id: string
          is_active: boolean | null
          trial_end_date: string | null
          trial_start_date: string | null
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_activity_counts: {
        Row: {
          highlights_count: number | null
          posts_count: number | null
          replies_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_comment_profiles: {
        Args: {
          comment_row: unknown
        }
        Returns: {
          avatar_url: string | null
          background_url: string | null
          bio: string | null
          genres: string[] | null
          id: string
          pinned_work: Json | null
          skills: string[] | null
          social_links: Json | null
          username: string | null
        }[]
      }
      get_message_sender_profiles: {
        Args: {
          message_row: unknown
        }
        Returns: {
          avatar_url: string | null
          background_url: string | null
          bio: string | null
          genres: string[] | null
          id: string
          pinned_work: Json | null
          skills: string[] | null
          social_links: Json | null
          username: string | null
        }[]
      }
      get_post_profiles: {
        Args: {
          post_row: unknown
        }
        Returns: {
          avatar_url: string | null
          background_url: string | null
          bio: string | null
          genres: string[] | null
          id: string
          pinned_work: Json | null
          skills: string[] | null
          social_links: Json | null
          username: string | null
        }[]
      }
      get_user_activity: {
        Args: {
          user_id: string
        }
        Returns: {
          posts_count: number
          replies_count: number
          highlights_count: number
        }[]
      }
    }
    Enums: {
      ai_model_type: "gpt-4o" | "gpt-4o-mini"
      challenge_difficulty: "easy" | "medium" | "hard"
      document_section_type: "chapter" | "scene" | "note" | "timeline"
      goal_frequency: "daily" | "weekly" | "monthly"
      goal_type: "word_count" | "time_based"
      group_privacy: "public" | "private"
      group_type: "social" | "writing"
      milestone_type:
        | "ending"
        | "major_event"
        | "character_decision"
        | "theme_setup"
      relationship_type:
        | "friend"
        | "enemy"
        | "family"
        | "mentor"
        | "student"
        | "rival"
        | "lover"
        | "ally"
        | "neutral"
      story_issue_type:
        | "plot_hole"
        | "timeline_inconsistency"
        | "pov_inconsistency"
        | "character_inconsistency"
        | "setting_inconsistency"
        | "logic_flaw"
      tension_point_type: "rising" | "climax" | "falling" | "resolution"
      topic_privacy: "public" | "private" | "friends"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
