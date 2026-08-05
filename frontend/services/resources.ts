import { api, buildQueryString } from "@/lib/api-client";
import type { PaginatedResponse } from "@/types/api";

export type ResourceRow = Record<string, unknown>;

export interface ResourceListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string | null;
  order?: "asc" | "desc";
}

/** Generic resource service — one endpoint pattern for every module. */
export const resourceService = {
  list: (resource: string, params: ResourceListParams = {}) =>
    api.get<PaginatedResponse<ResourceRow>>(
      `/${resource}${buildQueryString({
        page: params.page,
        per_page: params.per_page,
        search: params.search,
        sort: params.sort,
        order: params.order,
      })}`
    ),
  create: (resource: string, data: ResourceRow) =>
    api.post<{ data: ResourceRow }>(`/${resource}`, data),
  update: (resource: string, id: string, data: ResourceRow) =>
    api.patch<{ data: ResourceRow }>(`/${resource}/${id}`, data),
  remove: (resource: string, id: string) =>
    api.delete<void>(`/${resource}/${id}`),
};
