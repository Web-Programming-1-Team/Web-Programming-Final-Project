(function($){
    // $(`.imgInput`).on('change',function(){
    //     let self = this;
    //     // $(self).parent().find('input').css('display','none');
    //     $(self).css('display','none');
    //     let formData = new FormData();
    //     formData.append('file', this.files[0]);
    //     $.ajax({
    //         url: '/recipes/upload',
    //         type: 'POST',
    //         data :formData,
    //         cache:false,
    //         processData: false,
    //         contentType: false,
    //         success:function(data){
    //             if(data.code === 200){
    //                 $(self).parent().find('img').attr('src', data.data);
    //             }else{
    //             }
    //         },
    //         error:function(){
    //         }
    //     });
    // });

    $("#add-step").on('click',function(){
        const new_step = '<div class="steps">\n' +
            '        <label for="title">\n' +
            '            <input name="title">\n' +
            '        </label>\n' +
            '        <input type="file" class="imgInput">\n' +
            '        <img class="upload-preview" src="" width="320" height="240">\n' +
            '    </div>';
        let step_list = $("#steps-list");
        step_list.append(new_step);
        $(`.imgInput`).on('change',function(){
            let self = this;
            // $(self).parent().find('input').css('display','none');
            $(self).css('display','none');
            let formData = new FormData();
            formData.append('file', this.files[0]);
            $.ajax({
                url: '/recipes/upload',
                type: 'POST',
                data :formData,
                cache:false,
                processData: false,
                contentType: false,
                success:function(data){
                    if(data.code === 200){
                        $(self).parent().find('img').attr('src', data.data);
                    }else{
                    }
                },
                error:function(){
                }
            });
        });
    });

})(jQuery);