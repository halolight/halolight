import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fileService } from "@/lib/api/services"

// 查询键
export const fileKeys = {
  all: ["files"] as const,
  lists: () => [...fileKeys.all, "list"] as const,
  list: (path?: string) => [...fileKeys.lists(), path] as const,
  storage: () => [...fileKeys.all, "storage"] as const,
}

// 获取文件列表
export function useFiles(path?: string) {
  return useQuery({
    queryKey: fileKeys.list(path),
    queryFn: () => fileService.getFiles({ path }),
  })
}

// 获取存储信息
export function useStorage() {
  return useQuery({
    queryKey: fileKeys.storage(),
    queryFn: () => fileService.getStorage(),
  })
}

// 上传文件
export function useUploadFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, path }: { file: File; path?: string }) =>
      fileService.uploadFile(file, path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() })
      queryClient.invalidateQueries({ queryKey: fileKeys.storage() })
    },
  })
}

// 创建文件夹
export function useCreateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, path }: { name: string; path?: string }) =>
      fileService.createFolder(name, path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() })
    },
  })
}

// 删除文件
export function useDeleteFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fileService.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() })
      queryClient.invalidateQueries({ queryKey: fileKeys.storage() })
    },
  })
}

// 移动文件
export function useMoveFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, targetPath }: { id: string; targetPath: string }) =>
      fileService.moveFile(id, targetPath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() })
    },
  })
}

// 重命名文件
export function useRenameFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      fileService.renameFile(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() })
    },
  })
}
