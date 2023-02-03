import type { Job } from '../../models'

export type JobDto = Readonly<
  Pick<Job, 'id' | 'description' | 'price' | 'paid' | 'paymentDate' | 'ContractId'>
>
