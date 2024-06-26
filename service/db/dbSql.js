const userTableSql = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(100),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`

// 问卷列表
const surveysTableSql = `CREATE TABLE IF NOT EXISTS surveys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isPublished BOOLEAN DEFAULT FALSE,
    isStar BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    isDeleted BOOLEAN DEFAULT FALSE,
    userId INT,
    isShowOrderIndex BOOLEAN DEFAULT TRUE,
    isEnableFeedback BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
  );`

// 整个系统的组件表
const systemComponents = `CREATE TABLE IF NOT EXISTS system_components (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT
  icon VARCHAR(50)
);`

// 单个问卷对应的组件表
const questionComponents = `CREATE TABLE IF NOT EXISTS question_components (
  id INT AUTO_INCREMENT PRIMARY KEY,
  survey_id INT NOT NULL,
  component_id INT NOT NULL,·
  title VARCHAR(255),
  order_index INT NOT NULL DEFAULT 0,
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (component_id) REFERENCES system_components(id) ON DELETE RESTRICT ON UPDATE CASCADE
);`

// 单个问卷对应的单个组件中所对应的属性表
const componentProps = `CREATE TABLE IF NOT EXISTS component_properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  component_instance_id INT NOT NULL, 
  property_key VARCHAR(255) NOT NULL,
  property_value TEXT,
  option_mode ENUM('single', 'multiple') DEFAULT NULL,
  is_complex BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (component_instance_id) REFERENCES question_components(id) ON DELETE CASCADE ON UPDATE CASCADE
);`

// 多选或者单选对应的字段表
const componentOptions = `CREATE TABLE IF NOT EXISTS component_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  component_property_id INT NOT NULL,
  option_value VARCHAR(255) NOT NULL,
  option_text TEXT,
  is_default_selected BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (component_property_id) REFERENCES component_properties(id) ON DELETE CASCADE ON UPDATE CASCADE
);`

// 提交记录表
const submissionSql = `CREATE TABLE IF NOT EXISTS submissions (
  submission_id INT AUTO_INCREMENT PRIMARY KEY,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  device_info VARCHAR(255),
  browser_info VARCHAR(255),
  ip_address VARCHAR(45),
  survey_id INT NOT NULL,
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE RESTRICT ON UPDATE CASCADE
);`

// 答案表
const answersSql = `CREATE TABLE IF NOT EXISTS answers (
  answer_id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL,
  component_instance_id INT,
  question_type VARCHAR(50),
  answer_value TEXT,
  FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (component_instance_id) REFERENCES question_components(id) ON DELETE SET NULL ON UPDATE CASCADE
);`

// 验证码表
const codeSql = `CREATE TABLE IF NOT EXISTS verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
`

// 问卷反馈表
const surveyFeedbackSql = `CREATE TABLE IF NOT EXISTS Survey_Feedback (
  feedback_id INT AUTO_INCREMENT PRIMARY KEY,
  survey_id INT NOT NULL,
  username VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE ON UPDATE CASCADE
);`

// 反馈通知表
const feedbackNotificationsSql = `CREATE TABLE feedbackNotifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  survey_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (survey_id) REFERENCES surveys(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`

const uploadAnswerFiles = `CREATE TABLE uploadedFiles (
  file_id INT AUTO_INCREMENT PRIMARY KEY, -- 文件ID，自增主键
  storage_address VARCHAR(255) NOT NULL, -- 存储地址，如 'localhost:3031/uploads/headImg/***'
  filetype  VARCHAR(255), -- 文件类型
  upload_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 上传时间戳，自动设置为当前时间
  submit_status BOOLEAN NOT NULL DEFAULT FALSE, -- 提交状态，初始值为未提交（FALSE）
  survey_id INT NOT NULL, -- 关联的问卷ID
  FOREIGN KEY (survey_id) REFERENCES surveys(id) -- 外键约束，确保问卷ID存在
);`

const dbTable = [
  userTableSql,
  surveysTableSql,
  systemComponents,
  questionComponents,
  componentProps,
  componentOptions,
  answersSql,
  submissionSql,
  codeSql,
  surveyFeedbackSql,
  feedbackNotificationsSql,
  uploadAnswerFiles
]

module.exports = dbTable