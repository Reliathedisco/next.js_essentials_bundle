// Server action: Background job processing
'use server';

interface Job {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: any;
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Simple in-memory job queue (use Redis/BullMQ in production)
const jobQueue: Map<string, Job> = new Map();

export async function createJob(type: string, data: any): Promise<string> {
  const job: Job = {
    id: crypto.randomUUID(),
    type,
    status: 'pending',
    data,
    createdAt: new Date(),
  };
  
  jobQueue.set(job.id, job);
  
  // Process job asynchronously
  processJob(job.id).catch(console.error);
  
  return job.id;
}

export async function getJobStatus(jobId: string): Promise<Job | null> {
  return jobQueue.get(jobId) || null;
}

async function processJob(jobId: string): Promise<void> {
  const job = jobQueue.get(jobId);
  
  if (!job) return;
  
  job.status = 'processing';
  jobQueue.set(jobId, job);
  
  try {
    let result;
    
    switch (job.type) {
      case 'export-data':
        result = await exportData(job.data);
        break;
      case 'send-bulk-email':
        result = await sendBulkEmail(job.data);
        break;
      case 'generate-report':
        result = await generateReport(job.data);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
    
    job.status = 'completed';
    job.result = result;
    job.completedAt = new Date();
  } catch (error) {
    job.status = 'failed';
    job.error = error instanceof Error ? error.message : 'Unknown error';
    job.completedAt = new Date();
  }
  
  jobQueue.set(jobId, job);
}

async function exportData(data: any): Promise<any> {
  // Simulate long-running task
  await new Promise(resolve => setTimeout(resolve, 5000));
  return { exported: true, count: 100 };
}

async function sendBulkEmail(data: any): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return { sent: data.recipients?.length || 0 };
}

async function generateReport(data: any): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 8000));
  return { reportUrl: '/reports/sample.pdf' };
}
