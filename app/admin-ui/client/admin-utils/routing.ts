import { ReadonlyURLSearchParams, redirect } from "next/navigation";
import { SearchParamsKeys, SortingProps } from "./base-types";

class AdminSearchParams {
  _params: URLSearchParams = new URLSearchParams();

  constructor(
    searchParams: Record<string, string> | ReadonlyURLSearchParams = {}
  ) {
    // this._params = new URLSearchParams(searchParams);
    if (searchParams instanceof URLSearchParams) {
      this._params = searchParams;
    } else {
      this._params = new URLSearchParams(
        searchParams as Record<string, string>
      );
    }
  }

  static create(
    searchParams?: Record<string, string> | ReadonlyURLSearchParams
  ) {
    return new AdminSearchParams(searchParams);
  }

  get(key: SearchParamsKeys) {
    return this._params.get(key);
  }

  set(key: SearchParamsKeys, value: string) {
    this._params.set(key, value);
    return this;
  }

  delete(key: SearchParamsKeys) {
    this._params.delete(key);
    return this;
  }

  toString() {
    return this._params.toString();
  }
}

export const redirectSearchParams = ({
  searchParams,
  key,
  value,
}: {
  searchParams?: Record<string, string>;
  key: SearchParamsKeys;
  value: string;
}) => {
  redirect(
    `?${AdminSearchParams.create(searchParams).set(key, value).toString()}`
  );
};

export const redirectToView = (
  searchParams: Record<string, string> = {},
  view: string
): never => {
  return redirectSearchParams({ searchParams, key: "view", value: view });
};

export const getCurrentView = (
  searchParams: Record<string, string> | ReadonlyURLSearchParams = {}
) => {
  return AdminSearchParams.create(searchParams).get("view") as string;
};

export const getQuery = (
  searchParams: Record<string, string> | ReadonlyURLSearchParams = {}
) => {
  return AdminSearchParams.create(searchParams).get("query") ?? "";
};

// class Routing

interface IRouting {
  // redirectSearchParams: () => void;
  getCurrentView: () => void;
  getQuery: () => void;
  redirectToView: (view: string) => void;
  toString: () => string;
}

export class Routing implements IRouting {
  searchParamsHelper = AdminSearchParams.create(this.searchParams);

  constructor(
    private searchParams: Record<string, string> | ReadonlyURLSearchParams = {}
  ) {
    return this;
  }

  static create(
    searchParams: Record<string, string> | ReadonlyURLSearchParams
  ) {
    return new Routing(searchParams);
  }

  getQuery() {
    return this.searchParamsHelper.get("query") ?? "";
  }

  getCurrentView() {
    return this.searchParamsHelper.get("view") as string;
  }

  getSorting(): SortingProps {
    // this.searchParamsHelper.set("orderBy", sorting.direction);
    // this.searchParamsHelper.set("orderByField", sorting.id);
    const orderBy = this.searchParamsHelper.get("orderBy") as "asc" | "desc";
    const orderByField = this.searchParamsHelper.get("orderByField") as string;

    return {
      direction: orderBy,
      id: orderByField,
    };
  }

  redirectToView(view: string) {
    this.searchParamsHelper.set("view", view);
    return this;
  }

  // updateCommandbar()

  updateQuery(query: string) {
    this.searchParamsHelper.set("query", query);
    return this;
  }

  updateSorting(sorting: SortingProps | null) {
    if (!sorting) {
      this.searchParamsHelper.delete("orderBy").delete("orderByField");
    } else {
      this.searchParamsHelper.set("orderBy", sorting.direction);
      this.searchParamsHelper.set("orderByField", sorting.id);
    }
    return this;
  }

  toString() {
    return this.searchParamsHelper.toString();
  }
}
