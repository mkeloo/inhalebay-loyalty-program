export const STORE_CODE = 5751;

export type MemberTier = {
    id: number;
    member_tier_name: string;
    description: string;
    value_type: "days" | "points";
    value: number;
    created_at?: string;
    updated_at?: string;
};


export type Reward = {
    id: number;
    title: string;
    reward_name: string;
    unlock_points: number | null;
    reward_type: "promo" | "reward";
    days_left: number | null;
    created_at?: string;
    updated_at?: string;
};


export type ScreenCode = {
    id: number;
    store_id: string;
    screen_name: string;
    screen_code: number;
    created_at?: string;
    updated_at?: string;
};


export type Customers = {
    id?: string;
    store_id?: string;
    phone_number?: string;
    name?: string;
    avatar_name?: string;
    current_points?: number;
    lifetime_points?: number;
    total_visits?: number;
    last_visit?: string;
    joined_date?: string;
    membership_level?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
};