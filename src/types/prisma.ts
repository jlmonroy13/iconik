import { Prisma } from '../generated/prisma';

// Base Prisma types
export type Spa = Prisma.SpaGetPayload<Record<string, never>>;
export type Branch = Prisma.BranchGetPayload<Record<string, never>>;
export type User = Prisma.UserGetPayload<Record<string, never>>;
export type Service = Prisma.ServiceGetPayload<Record<string, never>>;
export type Manicurist = Prisma.ManicuristGetPayload<Record<string, never>>;
export type Client = Prisma.ClientGetPayload<Record<string, never>>;
export type Appointment = Prisma.AppointmentGetPayload<Record<string, never>>;
export type Payment = Prisma.PaymentGetPayload<Record<string, never>>;

// Extended types with relations
export type SpaWithBranches = Prisma.SpaGetPayload<{
  include: {
    branches: true;
  };
}>;

export type SpaWithStats = Prisma.SpaGetPayload<{
  include: {
    branches: {
      include: {
        _count: {
          select: {
            clients: true;
            manicurists: true;
            appointments: true;
          };
        };
      };
    };
    _count: {
      select: {
        clients: true;
        manicurists: true;
        services: true;
        appointments: true;
        users: true;
      };
    };
  };
}>;

export type BranchWithStats = Prisma.BranchGetPayload<{
  include: {
    _count: {
      select: {
        clients: true;
        manicurists: true;
        services: true;
        appointments: true;
      };
    };
  };
}>;

export type ServiceWithBranch = Prisma.ServiceGetPayload<{
  include: {
    branch: true;
    _count: {
      select: {
        appointmentServices: true;
      };
    };
  };
}>;

export type ManicuristWithBranch = Prisma.ManicuristGetPayload<{
  include: {
    branch: true;
    _count: {
      select: {
        appointments: true;
      };
    };
  };
}>;

export type ClientWithBranch = Prisma.ClientGetPayload<{
  include: {
    branch: true;
    _count: {
      select: {
        appointments: true;
      };
    };
  };
}>;

export type AppointmentWithDetails = Prisma.AppointmentGetPayload<{
  include: {
    client: true;
    manicurist: true;
    branch: true;
    services: {
      include: {
        service: true;
        manicurist: true;
      };
    };
    payments: {
      include: {
        paymentMethod: true;
      };
    };
  };
}>;

// Form types for creating/updating
export type SpaCreateInput = Prisma.SpaCreateInput;
export type SpaUpdateInput = Prisma.SpaUpdateInput;
export type BranchCreateInput = Prisma.BranchCreateInput;
export type BranchUpdateInput = Prisma.BranchUpdateInput;
export type ServiceCreateInput = Prisma.ServiceCreateInput;
export type ServiceUpdateInput = Prisma.ServiceUpdateInput;
export type ManicuristCreateInput = Prisma.ManicuristCreateInput;
export type ManicuristUpdateInput = Prisma.ManicuristUpdateInput;
export type ClientCreateInput = Prisma.ClientCreateInput;
export type ClientUpdateInput = Prisma.ClientUpdateInput;
export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;

// Where clause types for filtering
export type SpaWhereInput = Prisma.SpaWhereInput;
export type BranchWhereInput = Prisma.BranchWhereInput;
export type ServiceWhereInput = Prisma.ServiceWhereInput;
export type ManicuristWhereInput = Prisma.ManicuristWhereInput;
export type ClientWhereInput = Prisma.ClientWhereInput;
export type AppointmentWhereInput = Prisma.AppointmentWhereInput;

// Select types for optimized queries
export type SpaSelect = Prisma.SpaSelect;
export type BranchSelect = Prisma.BranchSelect;
export type ServiceSelect = Prisma.ServiceSelect;
export type ManicuristSelect = Prisma.ManicuristSelect;
export type ClientSelect = Prisma.ClientSelect;
export type AppointmentSelect = Prisma.AppointmentSelect;

// Include types for relations
export type SpaInclude = Prisma.SpaInclude;
export type BranchInclude = Prisma.BranchInclude;
export type ServiceInclude = Prisma.ServiceInclude;
export type ManicuristInclude = Prisma.ManicuristInclude;
export type ClientInclude = Prisma.ClientInclude;
export type AppointmentInclude = Prisma.AppointmentInclude;
