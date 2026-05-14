import { InvalidPatientNameError } from "./patient.errors";

export type PatientProps = {
  id?: string;
  name: string;
  cpf: string;
  susCard: string;
  birthDate: string;
  rg: string;
  phone: string;
};

export class PatientEntity {
  private constructor(private readonly props: PatientProps) {}

  static create(props: PatientProps): PatientEntity {
    const name = props.name.trim();

    if (!name) {
      throw new InvalidPatientNameError();
    }

    return new PatientEntity({
      ...props,
      name,
    });
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get cpf(): string {
    return this.props.cpf;
  }

  get susCard(): string {
    return this.props.susCard;
  }

  get birthDate(): string {
    return this.props.birthDate;
  }

  get rg(): string {
    return this.props.rg;
  }

  get phone(): string {
    return this.props.phone;
  }

  toObject(): PatientProps {
    return { ...this.props };
  }
}
