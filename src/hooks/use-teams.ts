"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { roleService, teamService } from "@/lib/api/services"
import type { RoleCreateRequest, RoleUpdateRequest, TeamCreateRequest, TeamUpdateRequest } from "@/lib/api/types"
import { roleKeys, teamKeys } from "@/lib/query-keys"

// ============================================================================
// 团队查询 Hooks
// ============================================================================

/**
 * 获取团队列表
 */
export function useTeams() {
  return useQuery({
    queryKey: teamKeys.list(),
    queryFn: () => teamService.getTeams(),
  })
}

/**
 * 获取单个团队
 */
export function useTeam(id: string) {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => teamService.getTeam(id),
    enabled: !!id,
  })
}

/**
 * 创建团队
 */
export function useCreateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TeamCreateRequest) => teamService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() })
    },
  })
}

/**
 * 更新团队
 */
export function useUpdateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TeamUpdateRequest }) =>
      teamService.updateTeam(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() })
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(id) })
    },
  })
}

/**
 * 删除团队
 */
export function useDeleteTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => teamService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.list() })
    },
  })
}

// ============================================================================
// 角色查询 Hooks
// ============================================================================

/**
 * 获取角色详情列表
 */
export function useRolesDetail() {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: () => roleService.getRoles(),
  })
}

/**
 * 获取单个角色
 */
export function useRoleDetail(id: string) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleService.getRole(id),
    enabled: !!id,
  })
}

/**
 * 获取权限列表
 */
export function usePermissions() {
  return useQuery({
    queryKey: roleKeys.permissions(),
    queryFn: () => roleService.getPermissions(),
  })
}

/**
 * 创建角色
 */
export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RoleCreateRequest) => roleService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.list() })
    },
  })
}

/**
 * 更新角色
 */
export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoleUpdateRequest }) =>
      roleService.updateRole(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.list() })
      queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) })
    },
  })
}

/**
 * 删除角色
 */
export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.list() })
    },
  })
}

// ============================================================================
// 导出 Query Keys
// ============================================================================

export { roleKeys, teamKeys }
