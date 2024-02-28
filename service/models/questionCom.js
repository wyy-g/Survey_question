const { executeQuery } = require('../db/index')

exports.getAllQuesComModel = () => {
    return executeQuery(
        `select * from system_components`
    )
}

// 根据组件类型找到组件ID
exports.getSingleSystemCom = (type) => {
    return executeQuery(
        `select id as systemComId from system_components where type = ?`,
        [type]
    )
}

// 获取复杂属性的key和value
exports.getComponentComplexPropModel = (comId) => {
    return executeQuery(
        `select * from component_options where component_property_id = ?`,
        [comId]
    )
}

// 更新问卷中的组件（标题。索引）
exports.updateComponentModel = (comId, title, order_index) => {
    return executeQuery(
        `UPDATE question_components
        SET title = ?, order_index = ?
        WHERE id = ?`,
        [title, order_index, comId]
    )
}
// 根据id获取单个问卷里面的组件列表，用于判断是否存在改组件
exports.getSingleCom = (comId) => {
    return executeQuery(
        `select * from question_components where id = ?`,
        [comId]
    )
}
// 向组件表中插入组件的信息
exports.addComInfo = ({ id, surver_id, component_id, title, order_index }) => {
    return executeQuery(
        `INSERT INTO question_components
         (id,survey_id, component_id, title, order_index) VALUES (?,?, ?, ?, ?)`,
        [id, surver_id, component_id, title, order_index]
    )
}
// 根据id删除组件表中组件
exports.delComModel = (id) => {
    return executeQuery(
        `DELETE FROM question_components WHERE id = ?;`,
        [id]
    )
}

// 更新问卷中的组件的属性
exports.updateComponentPropModel = ({ comId, property_key, property_value }) => {
    return executeQuery(
        `UPDATE component_properties
        SET property_value = ?
        WHERE component_instance_id = ? and property_key = ?`,
        [property_value, comId, property_key]
    )
}

// 插入问卷中的组件的属性
exports.addComPropInfo = ({ comId, property_key, property_value, option_mode, is_complex }) => {
    return executeQuery(
        `INSERT INTO component_properties
         (component_instance_id, property_key, property_value, option_mode, is_complex) VALUES (?,?,?,?,?)`,
        [comId, property_key, property_value, option_mode, is_complex]
    )
}

// 查找组件属性表中是否存在该属性
exports.getSingleComProp = ({ comId, property_key }) => {
    return executeQuery(
        `select * from component_properties where component_instance_id = ? and property_key = ?`,
        [comId, property_key]
    )
}

// 新增单选多选的选项表中的选项
exports.addOptionItem = ({ propId, value, text, checked }) => {
    return executeQuery(
        `INSERT INTO component_options
         (component_property_id, value, text, checked) VALUES (?,?,?, ?)`,
        [propId, value, text, checked]
    )
}

// 从数据库中根据属性id和value（id和value能限制到是那一个选项）查找改选项是否存在，没有value就是获取该属性的所有选项
exports.getComplexPropOption = ({ propId, value }) => {
    if (value) {
        return executeQuery(
            `select * from component_options where component_property_id = ? and value = ?`,
            [propId, value]
        )
    } else {
        return executeQuery(
            `select * from component_options where component_property_id = ?`,
            [propId,]
        )
    }

}

// 更新选项表
exports.updateComplexPropOption = ({ propId, value, text, checked }) => {
    return executeQuery(
        `UPDATE component_options
        SET text = ?,checked = ?
        WHERE component_property_id = ? and value = ?`,
        [text, checked, propId, value]
    )
}

//根据对应的属性id和value去删除选项表 中的具体某个选项
exports.delOptionModel = ({ propId, value }) => {
    return executeQuery(
        `delete from component_options where component_property_id = ? and value = ?`,
        [propId, value]
    )
}

