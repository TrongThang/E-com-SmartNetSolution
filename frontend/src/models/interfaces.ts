export interface IApiResponse {
    success: boolean
    data?: any
    error?: string
    message?: string
    status_code?: number
}

export interface IPlanning {
    planning_id: string
    planning_note: string
    created_by: string
    created_at: string
    updated_at: string
    is_deleted: boolean
    status: string
    batches: IBatch[]
}

export interface IBatch {
    production_batch_id: string
    template_id: number
    template_name: string
    quantity: number
    status: string
    created_at: string
    created_by: string
    batch_note: string
    firmware_id?: number
    firmware_name?: string
    firmware_version?: string
} 


export interface IPlanningPDF {
    planning_id: string;
    planning_note: string;
    status: string;
    created_at: string;
    production_batches: Array<{
      production_batch_id: string;
      device_templates: {
        name: string;
      };
      quantity: number;
      batch_note: string;
      status: string;
      production_tracking: Array<{
        device_serial: string;
        status: string;
        stage: string;
      }>;
    }>;
  }