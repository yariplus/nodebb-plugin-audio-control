<form id="audio-control" class="col-lg-9 col-md-12">
    <div class="form-group">
        <label class="form-label h3">Audio Source</label>
        <input class="form-control" type="text" data-key="source"></input>
        <br>
        <button class="form-control btn btn-success" type="button" id="save">Set source and update clients.</input>
    </div>
</form>

<script type="text/javascript">

require(['settings'], function(settings) {

    settings.sync('audio-control', $('#audio-control'));

    $('#save').click(function (event) {
        settings.persist('audio-control', $('#audio-control'), function(){
            socket.emit('admin.settings.syncAudioControl');
        });
    });
});

</script>
