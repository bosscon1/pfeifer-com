<?php
declare(strict_types=1);

/**
 * Copy this file to config.php on SiteGround (File Manager).
 * Do not commit config.php — it holds secrets.
 *
 * MySQL uses localhost (the web server talking to MySQL on the same box).
 * Google: Cloud Console → APIs → Credentials → OAuth client (Web).
 * Redirect URI: your explicitly authorized staging origin + /api/bridge/google-callback.php
 */
return [
    'mysql_host' => 'localhost',
    'mysql_port' => 3306,
    'mysql_user' => 'uu8bt0zzukrhm',
    'mysql_password' => 'CHANGE_ME',
    'mysql_database' => 'dbeemfkinruaxd',
    'google_client_id' => '',
    'google_client_secret' => '',
    'staff_email_domain' => 'pfeiferbuild.com',
    // Use a staging origin here. Never use the production WordPress origin
    // until an explicit, separately approved go-live migration.
    'public_origin' => 'https://staging.example.invalid',
    // Durable uploads live outside Git-managed public/images and public/videos.
    'media_root' => '',
    'media_url_prefix' => '/uploads',
];
