import { InvalidRouteDestinationError } from "./routes.errors";

export type RouteProps = {
  id?: string;
  destination: string;
};

export class RouteEntity {
  private constructor(private readonly props: RequiredRouteProps) {}

  static create(props: RouteProps): RouteEntity {
    const destination = props.destination?.trim();

    if (!destination) {
      throw new InvalidRouteDestinationError();
    }

    return new RouteEntity({
      ...props,
      destination,
    });
  }

  toObject(): RequiredRouteProps {
    return { ...this.props };
  }
}

type RequiredRouteProps = RouteProps;
