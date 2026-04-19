jQuery(document).ready(function($) {
    $('#fanza-gen').on('click', function() {
        const cid = $('#fanza-cid').val();
        const save_all = $('#fanza-save-all').is(':checked');
        const post_id = $('#post_ID').val();
        $('#fanza-spinner').show();

        $.post(FANZA_AIO.ajax_url, {
            action: 'fanza_fetch',
            nonce: FANZA_AIO.nonce,
            cid: cid,
            save_all: save_all,
            post_id: post_id
        }, function(res) {
            $('#fanza-spinner').hide();
            if (res.success) {
                $('#fanza-result').show();
                $('#fanza-title').val(res.data.title);
                $('#fanza-table').val(res.data.table);
                $('#fanza-imgs').val(res.data.imgs);
                $('#fanza-video').val(res.data.video);
                $('#fanza-link').val(res.data.link);
            } else {
                alert(res.data);
            }
        });
    });

    function copyToClipboard(selector, button) {
        const text = $(selector).val();
        navigator.clipboard.writeText(text).then(() => {
            const original = $(button).text();
            $(button).text('✓ コピー完了').prop('disabled', true);
            setTimeout(() => {
                $(button).text(original).prop('disabled', false);
            }, 1500);
        });
    }

    $('#fanza-copy-title').on('click', function() { copyToClipboard('#fanza-title', this); });
    $('#fanza-copy-table').on('click', function() { copyToClipboard('#fanza-table', this); });
    $('#fanza-copy-imgs').on('click', function() { copyToClipboard('#fanza-imgs', this); });
    $('#fanza-copy-video').on('click', function() { copyToClipboard('#fanza-video', this); });
    $('#fanza-copy-link').on('click', function() { copyToClipboard('#fanza-link', this); });
});
