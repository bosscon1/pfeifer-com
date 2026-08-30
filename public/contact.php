<?php
declare(strict_types=1);

/**
 * SiteGround form handler. Emails office@pfeiferbuild.com.
 * If mail() is disabled, point the form action at Formspree instead.
 */

function field(string $key, int $max = 2000): string
{
    $value = trim((string) ($_POST[$key] ?? ''));
    $value = str_replace(["\r", "\n"], ' ', $value);
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max);
    }
    return substr($value, 0, $max);
}

function page(string $title, string $bodyHtml): void
{
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<title>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</title>';
    echo '<style>
      body{margin:0;font-family:"Segoe UI",sans-serif;background:#fff;color:#1c1f24}
      .bar{background:#3a4048;color:#fff;padding:1rem 1.25rem;font-weight:700;letter-spacing:.08em}
      .wrap{max-width:40rem;margin:3rem auto;padding:0 1.25rem}
      a{color:#1e4f9a}
      .btn{display:inline-block;margin-top:1.5rem;background:#1e4f9a;color:#fff;text-decoration:none;padding:.85rem 1.25rem;font-size:.85rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
    </style></head><body>';
    echo '<div class="bar">PFEIFER BUILDING COMPANY</div><div class="wrap">';
    echo $bodyHtml;
    echo '</div></body></html>';
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: /contact/', true, 302);
    exit;
}

if (field('website', 200) !== '') {
    page('Request received', '<h1>Thanks</h1><p>We have your request.</p><a class="btn" href="/">Back to home</a>');
}

$name = field('name', 200);
$phone = field('phone', 80);
$email = field('email', 200);
$city = field('city', 200);
$project = field('project_type', 80);
$preferred = field('preferred', 40);
$message = field('message', 4000);

if ($name === '' || ($phone === '' && $email === '')) {
    page(
        'Missing information',
        '<h1>We need a little more</h1><p>Please include your name and a phone number or email so we can reach you.</p><a class="btn" href="/contact/">Back to the form</a>'
    );
}

$to = 'office@pfeiferbuild.com';
$subject = 'Website bid request from ' . $name;
$lines = [
    'Name: ' . $name,
    'Phone: ' . $phone,
    'Email: ' . $email,
    'City / neighborhood: ' . $city,
    'Project type: ' . $project,
    'Preferred contact: ' . $preferred,
    '',
    $message,
];
$body = implode("\n", $lines);

$reply = $email !== '' ? $email : $to;
$headers = [
    'From: Pfeifer Website <office@pfeiferbuild.com>',
    'Reply-To: ' . $reply,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: Pfeifer-contact.php',
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    page(
        'Request sent',
        '<h1>Thanks. We have it.</h1><p>Someone from the Tyrone office will follow up. If you need us sooner, call <a href="tel:7704871380">770-487-1380</a>.</p><a class="btn" href="/">Back to home</a>'
    );
}

page(
    'Could not send',
    '<h1>The form did not send</h1><p>Please call <a href="tel:7704871380">770-487-1380</a> or email <a href="mailto:office@pfeiferbuild.com">office@pfeiferbuild.com</a>. If this keeps happening, point the form at Formspree.</p><a class="btn" href="/contact/">Try again</a>'
);
