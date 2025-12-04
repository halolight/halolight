/**
 * Server Actions 统一导出
 *
 * 使用示例：
 * ```tsx
 * import { loginAction, createUserAction } from "@/actions"
 *
 * // 在表单中使用
 * async function handleSubmit(formData: FormData) {
 *   const result = await loginAction({
 *     email: formData.get("email") as string,
 *     password: formData.get("password") as string,
 *   })
 *
 *   if (result.success) {
 *     // 处理成功
 *   } else {
 *     // 处理错误
 *     console.error(result.error)
 *   }
 * }
 * ```
 */

// 认证相关
export {
  getCurrentUserAction,
  loginAction,
  logoutAction,
} from "./user"

// 用户管理
export {
  batchDeleteUsersAction,
  createUserAction,
  deleteUserAction,
  getUsersAction,
  updateUserAction,
  updateUserStatusAction,
} from "./user"

// 用户类型
export type {
  ActionResult,
  LoginFormData,
  UserFormData,
} from "./user"

// 文档管理
export {
  addDocumentTagsAction,
  batchDeleteDocumentsAction,
  createDocumentAction,
  deleteDocumentAction,
  getDocumentAction,
  getDocumentsAction,
  moveDocumentAction,
  renameDocumentAction,
  shareDocumentAction,
  unshareDocumentAction,
  updateDocumentAction,
} from "./document"

// 文档类型
export type {
  DocumentFormData,
  DocumentSearchParams,
} from "./document"

// 日历事件
export {
  addEventAttendeesAction,
  batchDeleteCalendarEventsAction,
  createCalendarEventAction,
  deleteCalendarEventAction,
  getCalendarEventAction,
  getCalendarEventsAction,
  removeEventAttendeeAction,
  rescheduleEventAction,
  updateCalendarEventAction,
} from "./calendar"

// 日历类型
export type {
  CalendarEventFormData,
  CalendarSearchParams,
} from "./calendar"

// 文件管理
export {
  batchDeleteFilesAction,
  copyFileAction,
  createFolderAction,
  deleteFileAction,
  getFileDownloadUrlAction,
  getFilesAction,
  getStorageInfoAction,
  moveFileAction,
  renameFileAction,
  shareFileAction,
  toggleFileFavoriteAction,
} from "./file"

// 文件类型
export type {
  FileSearchParams,
  FileUploadResult,
} from "./file"
