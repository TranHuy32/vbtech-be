import { ErrorCode } from './errors-list';

const defaultErrorMessages: Partial<Record<ErrorCode, string>> = {
  [ErrorCode.UNAUTHORIZED]: 'Chưa xác thực',
  [ErrorCode.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ',
  [ErrorCode.INSUFFICIENT_FUND]: 'Số dư không đủ',
  [ErrorCode.ACCOUNT_NOT_FOUND]: 'Không tìm thấy tài khoản',
  [ErrorCode.UPDATE_PASSWORD_FAILED]: 'Cập nhật mật khẩu thất bại',
  [ErrorCode.FORBIDDEN]: 'Không có quyền truy cập',
  [ErrorCode.PERM_NOT_FOUND]: 'Không tìm thấy nhóm quyền',
  [ErrorCode.INVALID_FILE_TYPE]: 'Loại tệp không hợp lệ',
  [ErrorCode.FILE_TOO_LARGE]: 'Tệp quá lớn',
  [ErrorCode.FILE_REQUIRED]: 'Vui lòng chọn tệp',
  [ErrorCode.FILE_NOT_FOUND]: 'Không tìm thấy tệp',
  [ErrorCode.FILE_UPLOAD_FAILED]: 'Tải tệp lên thất bại',
  [ErrorCode.PASSWORD_INCORRECT]: 'Mật khẩu không đúng',
  [ErrorCode.CATEGORY_NOT_FOUND]: 'Không tìm thấy danh mục',
  [ErrorCode.CATEGORY_ALREADY_EXISTS]: 'Danh mục đã tồn tại',
  [ErrorCode.CATEGORY_PARENT_NOT_FOUND]: 'Không tìm thấy danh mục cha',
  [ErrorCode.CATEGORY_LIST_FAILED]: 'Lấy danh sách danh mục thất bại',
  [ErrorCode.CATEGORY_CREATE_FAILED]: 'Tạo danh mục thất bại',
  [ErrorCode.CATEGORY_UPDATE_FAILED]: 'Cập nhật danh mục thất bại',
  [ErrorCode.CATEGORY_DELETE_FAILED]: 'Xóa danh mục thất bại',
  [ErrorCode.CATEGORY_HAS_CHILDREN]:
    'Không thể xóa danh mục vì còn danh mục con',
  [ErrorCode.PRODUCT_NOT_FOUND]: 'Không tìm thấy sản phẩm',
  [ErrorCode.PRODUCT_ALREADY_EXISTS]: 'Sản phẩm đã tồn tại',
  [ErrorCode.PRODUCT_CATEGORY_NOT_FOUND]: 'Không tìm thấy danh mục sản phẩm',
  [ErrorCode.PRODUCT_CREATE_FAILED]: 'Tạo sản phẩm thất bại',
  [ErrorCode.PRODUCT_UPDATE_FAILED]: 'Cập nhật sản phẩm thất bại',
  [ErrorCode.PRODUCT_DELETE_FAILED]: 'Xóa sản phẩm thất bại',
  [ErrorCode.PRODUCT_LIST_FAILED]: 'Lấy danh sách sản phẩm thất bại',
  [ErrorCode.ARTICLE_NOT_FOUND]: 'Không tìm thấy bài viết',
  [ErrorCode.ARTICLE_AUTHOR_NOT_FOUND]: 'Không tìm thấy tác giả bài viết',
  [ErrorCode.ARTICLE_LIST_FAILED]: 'Lấy danh sách bài viết thất bại',
  [ErrorCode.ARTICLE_CREATE_FAILED]: 'Tạo bài viết thất bại',
  [ErrorCode.ARTICLE_UPDATE_FAILED]: 'Cập nhật bài viết thất bại',
  [ErrorCode.ARTICLE_DELETE_FAILED]: 'Xóa bài viết thất bại',
  [ErrorCode.TELEGRAM_CONFIG_MISSING]: 'Thiếu cấu hình Telegram',
  [ErrorCode.TELEGRAM_SEND_FAILED]: 'Gửi tin nhắn Telegram thất bại',
};

export function resolveErrorMessage(code: ErrorCode) {
  return defaultErrorMessages[code] ?? ErrorCode[code];
}
