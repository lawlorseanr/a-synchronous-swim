(function() {

  const serverUrl = 'http://127.0.0.1:3001';

  const ajaxGetCommand = () => {
    setTimeout(ajaxGetCommand, 1000);
    var cmdUrl = `${serverUrl}/item`
    $.get(cmdUrl, data => {
      if (data) {
        SwimTeam.move(data);
      }
    })
  }
  ajaxGetCommand();

  const ajaxPostCommand = (cmd) => {
    var cmdUrl = `${serverUrl}/${cmd}`
    $.post(cmdUrl)
  }

  $('body').on('keydown', (event) => {
    var arrowPress = event.key.match(/Arrow(Up|Down|Left|Right)/);
    if (arrowPress) {
      var direction = arrowPress[1];
      ajaxPostCommand(direction);
    }
  });

  $('#spazzButton').on('click', event => {
    console.log(event);
  });

  /////////////////////////////////////////////////////////////////////
  // The ajax file uploader is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////
  var successcb;
  const ajaxFileUpload = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: `${serverUrl}/background`,
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      },
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUpload(file);
  });

})();
