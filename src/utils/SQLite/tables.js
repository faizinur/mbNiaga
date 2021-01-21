let DB_NAME = 'MobileCollection';
let TABLES = {
    dcoll_user: {
        column: [`user_id`, `password`, `group_id`, `created_by`, `created_time`, `updated_by`, `updated_time`, `first_name`, `last_name`, `is_login`, `last_login`, `session_id`, `flag_aktif`, `cd_collector`, `pass_date`, `pass_status`, `ip_address`, `npk`, `extension`, `account_number_handling`, `group_profile_id`, `branch_id`, `is_telephony`, `attempt_login`],
        name: 'dcoll_user',
    }
}

export {
    DB_NAME,
    TABLES,
}