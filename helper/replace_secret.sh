cp _config_base.yml _config.yml
sed -i -e "s/_leancloud_counter_security_username_/$leancloud_counter_security_username/g" _config.yml
sed -i -e "s/_leancloud_counter_security_password_/$leancloud_counter_security_password/g" _config.yml
sed -i -e "s/_leancloud_app_id_/$leancloud_app_id/g" _config.yml
sed -i -e "s/_leancloud_app_key_/$leancloud_app_key/g" _config.yml
sed -i -e "s/_gitalk_client_id_/$gitalk_client_id/g" _config.yml
sed -i -e "s/_gitalk_client_secret_/$gitalk_client_secret/g" _config.yml
sed -i -e "s/_GH_TOKEN_/${GH_TOKEN}/g" _config.yml
sed -i -e "s/_CODING_TOKEN_/${CODING_TOKEN}/g" _config.yml
sed -i -e "s/_google_analytics_tracking_id_/${google_analytics_tracking_id}/g" _config.yml