<?php
/*
Plugin Name: FANZA COPY
Description: 商品情報・画像・動画・リンクなどを一括取得し、コピー可能にするWordPressプラグイン
Version: 1.0
Author: きみまろ
Author: ChatGPT
Author: きみまろ
*/

if (!defined('ABSPATH')) exit;

class FANZA_Copy {
    const OPT_API  = 'fanzaif_api_id';
    const OPT_AFF  = 'fanzaif_affiliate_id';
    const OPT_BLOG = 'fanza_blog_affid';

    public function __construct() {
        add_action('admin_menu', [$this, 'add_settings']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('add_meta_boxes', [$this, 'add_meta_box']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('wp_ajax_fanza_fetch', [$this, 'ajax_fetch']);
    }

    public function add_settings() {
        add_options_page('FANZA COPY 設定', 'FANZA COPY', 'manage_options', 'fanza_copy_settings', [$this, 'render_settings']);
    }

    public function register_settings() {
        register_setting('fanza_copy_group', self::OPT_API);
        register_setting('fanza_copy_group', self::OPT_AFF);
        register_setting('fanza_copy_group', self::OPT_BLOG);
    }

    public function render_settings() {
        ?>
        <div class="wrap">
            <h1>FANZA COPY 設定</h1>
            <form method="post" action="options.php">
                <?php settings_fields('fanza_copy_group'); ?>
                <table class="form-table">
                    <tr><th scope="row">API ID</th>
                        <td><input name="<?php echo self::OPT_API; ?>" type="text" value="<?php echo esc_attr(get_option(self::OPT_API)); ?>" class="regular-text"></td></tr>
                    <tr><th scope="row">Affiliate ID（API用）</th>
                        <td><input name="<?php echo self::OPT_AFF; ?>" type="text" value="<?php echo esc_attr(get_option(self::OPT_AFF)); ?>" class="regular-text"></td></tr>
                    <tr><th scope="row">ブログ用アフィリエイトID</th>
                        <td><input name="<?php echo self::OPT_BLOG; ?>" type="text" value="<?php echo esc_attr(get_option(self::OPT_BLOG)); ?>" class="regular-text"></td></tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    public function add_meta_box() {
        add_meta_box('fanza_copy', 'FANZA COPY', [$this, 'render_meta_box'], ['post', 'page'], 'side');
    }

    public function enqueue_assets($hook) {
        if (in_array($hook, ['post.php', 'post-new.php'])) {
            wp_enqueue_script('fanza-copy-js', plugin_dir_url(__FILE__) . 'fanza-copy.js', ['jquery'], null, true);
            wp_localize_script('fanza-copy-js', 'FANZA_AIO', array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce'    => wp_create_nonce('fanza_aio')
            ));
        }
    }

    public function image_exists($url) {
        $headers = @get_headers($url);
        return (strpos($headers[0], '200') !== false);
    }

    public function download_and_attach_image($url, $post_id) {
        $tmp = download_url($url);
        if (is_wp_error($tmp)) return false;
        $file = [
            'name'     => basename($url),
            'type'     => mime_content_type($tmp),
            'tmp_name' => $tmp,
            'error'    => 0,
            'size'     => filesize($tmp),
        ];
        $id = media_handle_sideload($file, $post_id);
        return is_wp_error($id) ? false : wp_get_attachment_url($id);
    }

    public function render_meta_box($post) {
        echo '<p><input type="text" id="fanza-cid" class="widefat" placeholder="CIDを入力（例: abc123）"></p>';
        echo '<p><label><input type="checkbox" id="fanza-save-all"> 全画像をメディアに保存</label></p>';
        echo '<p><button id="fanza-gen" class="button button-primary">取得</button> <span id="fanza-spinner" style="display:none;">⏳</span></p>';
        echo '<div id="fanza-result" style="display:none;">
<p style="display:none;"><textarea id="fanza-title" class="widefat" rows="2"></textarea></p><p><button type="button" class="button" id="fanza-copy-title">タイトルをコピー</button></p>
<p style="display:none;"><textarea id="fanza-table" class="widefat" rows="4"></textarea></p><p><button type="button" class="button" id="fanza-copy-table">表をコピー</button></p>
<p style="display:none;"><textarea id="fanza-imgs" class="widefat" rows="4"></textarea></p><p><button type="button" class="button" id="fanza-copy-imgs">画像をコピー</button></p>
<p style="display:none;"><textarea id="fanza-video" class="widefat" rows="4"></textarea></p><p><button type="button" class="button" id="fanza-copy-video">動画をコピー</button></p>
<p style="display:none;"><textarea id="fanza-link" class="widefat" rows="2"></textarea></p><p><button type="button" class="button" id="fanza-copy-link">リンクをコピー</button></p>
</div>';
    }

    public function ajax_fetch() {
        check_ajax_referer('fanza_aio', 'nonce');
        $cid = sanitize_text_field($_POST['cid'] ?? '');
        $save_all = sanitize_text_field($_POST['save_all'] ?? '') === 'true';
        $post_id = intval($_POST['post_id'] ?? 0);

        if (!$cid) wp_send_json_error('CID未入力');

        $api_id = get_option(self::OPT_API);
        $aff_id = get_option(self::OPT_AFF);
        $blog_id = get_option(self::OPT_BLOG);

        if (!$api_id || !$aff_id) wp_send_json_error('API未設定');

        $args = [
            'api_id' => $api_id,
            'affiliate_id' => $aff_id,
            'site' => 'FANZA',
            'service' => 'digital',
            'floor' => 'videoa',
            'hits' => 1,
            'cid' => $cid,
            'output' => 'json'
        ];

        $res = wp_remote_get(add_query_arg($args, 'https://api.dmm.com/affiliate/v3/ItemList'));
        if (is_wp_error($res)) wp_send_json_error('APIエラー');
        $body = json_decode(wp_remote_retrieve_body($res), true);
        $item = $body['result']['items'][0] ?? null;
        if (!$item) wp_send_json_error('商品が見つかりません');

        $title = esc_html($item['title']);
        $cid_base = strtolower($cid);
        $prefix = substr($cid_base, 0, 3) === 'h_1' ? 'h_1' . substr($cid_base, 3) : $cid_base;
        $dir_url = "https://pics.dmm.co.jp/digital/video/{$prefix}/";
        $cover_url = $dir_url . "{$prefix}pl.jpg";
        $base_url = $dir_url . "{$prefix}jp";

        $date = isset($item['date']) ? date('Y/m/d', strtotime($item['date'])) : '----';
        $vol  = isset($item['volume']) ? $item['volume'] . '分' : '----';
        $acts = isset($item['iteminfo']['actress']) ? implode(', ', array_column($item['iteminfo']['actress'], 'name')) : '----';
        $dir  = isset($item['iteminfo']['director']) ? implode(', ', array_column($item['iteminfo']['director'], 'name')) : '----';
        $ser = isset($item['iteminfo']['series'][0]['name']) ? $item['iteminfo']['series'][0]['name'] : '----';
        $mak  = $item['iteminfo']['maker'][0]['name'] ?? '----';
        $lab  = $item['iteminfo']['label'][0]['name'] ?? '----';
        $gen  = isset($item['iteminfo']['genre']) ? implode(' ', array_column($item['iteminfo']['genre'], 'name')) : '----';

        $imgs = '';
// ジャケット画像は常に保存
$cover_img_url = $this->download_and_attach_image($cover_url, $post_id);
// 保存できたらアイキャッチに設定
if ($cover_img_url && $post_id) {
    $attachment_id = attachment_url_to_postid($cover_img_url);
    if ($attachment_id) {
        set_post_thumbnail($post_id, $attachment_id);
    }
}
        
        if ($cover_img_url && $save_all && $post_id) {
            // アイキャッチを設定
            $attachment_id = attachment_url_to_postid($cover_img_url);
            if ($attachment_id) {
                set_post_thumbnail($post_id, $attachment_id);
            }
        }
    if ($cover_img_url) $imgs .= "<p><img src='{$cover_img_url}' style='max-width:100%;' /></p>";

        for ($i = 1; $i <= 20; $i++) {
            $img_url = $base_url . '-' . $i . '.jpg';
            if ($this->image_exists($img_url)) {
                $final = $save_all ? $this->download_and_attach_image($img_url, $post_id) : $img_url;
                if ($final) $imgs .= "<p><img src='{$final}' style='max-width:100%;' /></p>";
            }
        }

        $video = "<div style='width:100%; padding-top: 75%; position:relative;'><iframe width='100%' height='100%' max-width='1280px' style='position: absolute; top: 0; left: 0;' src='https://www.dmm.co.jp/litevideo/-/part/=/affi_id={$blog_id}/cid={$cid}/size=1280_720/' scrolling='no' frameborder='0' allowfullscreen></iframe></div>";
        $link = "https://al.dmm.co.jp/?lurl=" . urlencode("https://www.dmm.co.jp/digital/videoa/-/detail/=/cid={$cid}/") . "&af_id={$blog_id}&ch=toolbar&ch_id=link";

        $table = "<!-- wp:table --><figure class='wp-block-table'><table><tbody>";
        $table .= "<tr><td>配信開始日</td><td>{$date}</td></tr>";
        $table .= "<tr><td>収録時間</td><td>{$vol}</td></tr>";
        $table .= "<tr><td>出演者</td><td>{$acts}</td></tr>";
        $table .= "<tr><td>監督</td><td>{$dir}</td></tr>";
        $table .= "<tr><td>シリーズ</td><td>{$ser}</td></tr>";
        $table .= "<tr><td>メーカー</td><td>{$mak}</td></tr>";
        $table .= "<tr><td>レーベル</td><td>{$lab}</td></tr>";
        $table .= "<tr><td>ジャンル</td><td>{$gen}</td></tr>";
        $table .= "<tr><td>品番</td><td>{$cid}</td></tr>";
        $table .= "</tbody></table></figure><!-- /wp:table -->";

        wp_send_json_success([
            'title' => $title,
            'table' => $table,
            'imgs'  => $imgs,
            'video' => $video,
            'link'  => "{$link}"
        ]);
    }
}

new FANZA_Copy();