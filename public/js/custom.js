$(document).ready(function () {
    $("#itable").DataTable({
        ajax: {
            url: "/api/item",
            dataSrc: "",
        },
        dom: "Bfrtip",
        buttons: [
            "pdf",
            "excel",
            {
                text: "Add Item",
                className: "btn btn-primary",
                action: function (e, dt, node, config) {
                    $("#iform").trigger("reset");
                    $("#itemModal").modal("show");
                },
            },
        ],
        columns: [{
                data: "item_id",
            },
            // {
            //     data: 'null',
            //     render : function{data, type, row}   
            // },
            {
                data: "description",
            },

            {
                data: "sell_price",
            },
            {
                data: "cost_price",
            },
            {
                data: "title",
            },
            // {
            //     data: "imagePath",
            // },
            {
                data: null,
                render: function (data, type, row) {
                    return "<a href='#' data-bs-toggle='modal' data-bs-target='#editModal' id='editbtn' data-id=" +
                        data.item_id +
                        "><i class='fa-solid fa-pen' aria-hidden='true' style='font-size:24px' ></i></a><a href='#' class='deletebtn' data-id=" + data.item_id + "><i class='fa-regular fa-trash-can' style='font-size:24px; color:red'></a></i>";
                },
            },
        ],
    });

    $("#items").hide();

    $("#item").on("click", function (e) {
        e.preventDefault();
        $("#customers").hide("slow");
        $("#items").show();

        $("#showCustomer").on("click", function (e) {
            e.preventDefault();
            $("#customers").show();
            $("#items").hide("slow");
        });
        $.ajax({
            type: "GET",
            url: "/api/item/",
            dataType: "json",
            success: function (data) {
                console.log(data);
                $.each(data, function (key, value) {
                    console.log(value);
                    var id = value.item_id;
                    var tr = $("<tr>");
                    tr.append($("<td>").html(value.item_id));
                    tr.append($("<td>").html(value.description));
                    tr.append($("<td>").html(value.cost_price));
                    tr.append($("<td>").html(value.sell_price));
                    tr.append($("<td>").html(value.imagePath));
                    tr.append($("<td>").html(value.title));
                    // tr.append(
                    //     "<td align='center'><a href=" +
                    //         "/api/customer/" +
                    //         id +
                    //         "/edit" +
                    //         "><i class='fa fa-pencil-square-o' aria-hidden='true' style='font-size:24px' ></a></i></td>"
                    // );
                    tr.append(
                        "<td align='center'><a href='#' data-bs-toggle='modal' data-bs-target='#editModal' id='editbtn' data-id=" +
                            id +
                            "><i class='fa fa-pencil-square-o' aria-hidden='true' style='font-size:24px' ></a></i></td>"
                    );
                    tr.append(
                        "<td><a href='#'  class='deletebtn' data-id=" +
                            id +
                            "><i  class='fa fa-trash-o' style='font-size:24px; color:red' ></a></i></td>"
                    );

                    $("#itable").append(tr);
                });
            },
            error: function () {
                console.log("AJAX load did not work");
                alert("error");
            },
        }); // Get All end

        $("#myFormSubmit").on("click", function (e) {
            e.preventDefault();
            var data = $("#cform").serialize();
            console.log(data);
            $.ajax({
                type: "post",
                url: "/api/item",
                data: data,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    $("myModal").modal("hide");
                    //  $('#myModal').each(function(){
                    //         $(this).modal('hide'); });
                    $.each(data, function (key, value) {
                        var tr = $("<tr>");
                        // tr.append($("<td>").html(data.customer_id));
                        tr.append($("<td>").html(data.description));
                        tr.append($("<td>").html(data.sell_price));
                        tr.append($("<td>").html(data.cost_price));
                        tr.append($("<td>").html(data.uploads));
                        // tr.append($("<td>").html(data.creditlimit));
                        // tr.append($("<td>").html(data.level));
                        $("#ctable").prepend(tr);
                    });
                },
                error: function (error) {
                    console.log("error");
                },
            });
        }); // Form Submit End

        $("#cbody").on("click", ".deletebtn", function (e) {
            var id = $(this).data("id");
            var $tr = $(this).closest("tr");
            // var id = $(e.relatedTarget).attr('id');
            console.log(id);
            e.preventDefault();
            bootbox.confirm({
                message: "Do you want to delete this item",
                buttons: {
                    confirm: {
                        label: "yes",
                        className: "btn-success",
                    },
                    cancel: {
                        label: "no",
                        className: "btn-danger",
                    },
                },
                callback: function (result) {
                    if (result)
                        $.ajax({
                            type: "DELETE",
                            url: "/api/customer/" + id,
                            headers: {
                                "X-CSRF-TOKEN": $(
                                    'meta[name="csrf-token"]'
                                ).attr("content"),
                            },
                            dataType: "json",
                            success: function (data) {
                                console.log(data);
                                // bootbox.alert('success');
                                $tr.find("td").fadeOut(2000, function () {
                                    $tr.remove();
                                });
                            },
                            error: function (error) {
                                console.log("error");
                            },
                        });
                },
            });
        }); //Delete end

        $("#editModal").on("show.bs.modal", function (e) {
            var id = $(e.relatedTarget).attr("data-id");
            console.log(id);
            $("<input>")
                .attr({
                    type: "hidden",
                    id: "customerid",
                    name: "customer_id",
                    value: id,
                })
                .appendTo("#updateform");
            $.ajax({
                type: "GET",
                url: "/api/customer/" + id + "/edit",
                success: function (data) {
                    console.log(data);
                    $("#etitle").val(data.title);
                    $("#euser_id").val(data.user_id);
                    $("#elname").val(data.lname);
                    $("#efname").val(data.fname);
                    $("#eaddress").val(data.addressline);
                    $("#etown").val(data.town);
                    $("#ezipcode").val(data.zipcode);
                    $("#ephone").val(data.phone);
                    $("#ecreditlimit").val(data.creditlimit);
                    $("#elevel").val(data.level);
                },
                error: function () {
                    console.log("AJAX load did not work");
                    alert("error");
                },
            });
        }); // Edit end

        $("#editModal").on("hidden.bs.modal", function (e) {
            $("#updateform").trigger("reset");
            $("#customerid").remove();
        }); // Edit modal reset end

        $("#updatebtn").on("click", function (e) {
            // e.preventDefault();
            var id = $("#customerid").val();
            var data = $("#updateform").serialize();
            console.log(data, id);
            $.ajax({
                type: "PUT",
                url: "api/customer/" + id,
                data: data,
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                        "content"
                    ),
                },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    console.log("success");
                    $("#editModal").each(function () {
                        $(this).modal("hide");
                    });
                },
                error: function (error) {
                    console.log("error");
                },
            });
        }); // Update btn end
    }); // Form Submit End

    $.ajax({
        type: "GET",
        url: "/api/customer/all",
        dataType: "json",
        success: function (data) {
            console.log(data);
            $.each(data, function (key, value) {
                console.log(value);
                var id = value.customer_id;
                var tr = $("<tr>");
                tr.append($("<td>").html(value.customer_id));
                tr.append($("<td>").html(value.title));
                tr.append($("<td>").html(value.lname));
                tr.append($("<td>").html(value.fname));
                tr.append($("<td>").html(value.addressline));
                tr.append($("<td>").html(value.phone));
                // tr.append(
                //     "<td align='center'><a href=" +
                //         "/api/customer/" +
                //         id +
                //         "/edit" +
                //         "><i class='fa fa-pencil-square-o' aria-hidden='true' style='font-size:24px' ></a></i></td>"
                // );
                tr.append(
                    "<td align='center'><a href='#' data-bs-toggle='modal' data-bs-target='#editModal' id='editbtn' data-id=" +
                        id +
                        "><i class='fa fa-pencil-square-o' aria-hidden='true' style='font-size:24px' ></a></i></td>"
                );
                tr.append(
                    "<td><a href='#'  class='deletebtn' data-id=" +
                        id +
                        "><i  class='fa fa-trash-o' style='font-size:24px; color:red' ></a></i></td>"
                );

                $("#cbody").append(tr);
            });
        },
        error: function () {
            console.log("AJAX load did not work");
            alert("error");
        },
    }); // Get All end

    $("#myFormSubmit").on("click", function (e) {
        e.preventDefault();
        var data = $("#cform").serialize();
        console.log(data);
        $.ajax({
            type: "post",
            url: "/api/customer",
            data: data,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                $("myModal").modal("hide");
                //  $('#myModal').each(function(){
                //         $(this).modal('hide'); });
                $.each(data, function (key, value) {
                    var tr = $("<tr>");
                    tr.append($("<td>").html(data.customer_id));
                    tr.append($("<td>").html(data.title));
                    tr.append($("<td>").html(data.lname));
                    tr.append($("<td>").html(data.fname));
                    tr.append($("<td>").html(data.addressline));
                    tr.append($("<td>").html(data.phone));
                    tr.append($("<td>").html(data.creditlimit));
                    tr.append($("<td>").html(data.level));
                    $("#ctable").prepend(tr);
                });
            },
            error: function (error) {
                console.log("error");
            },
        });
    }); // Form Submit End

    $("#cbody").on("click", ".deletebtn", function (e) {
        var id = $(this).data("id");
        var $tr = $(this).closest("tr");
        // var id = $(e.relatedTarget).attr('id');
        console.log(id);
        e.preventDefault();
        bootbox.confirm({
            message: "Do you want to delete this customer",
            buttons: {
                confirm: {
                    label: "yes",
                    className: "btn-success",
                },
                cancel: {
                    label: "no",
                    className: "btn-danger",
                },
            },
            callback: function (result) {
                if (result)
                    $.ajax({
                        type: "DELETE",
                        url: "/api/customer/" + id,
                        headers: {
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr(
                                "content"
                            ),
                        },
                        dataType: "json",
                        success: function (data) {
                            console.log(data);
                            // bootbox.alert('success');
                            $tr.find("td").fadeOut(2000, function () {
                                $tr.remove();
                            });
                        },
                        error: function (error) {
                            console.log("error");
                        },
                    });
            },
        });
    }); //Delete end

    $("#editModal").on("show.bs.modal", function (e) {
        var id = $(e.relatedTarget).attr("data-id");
        console.log(id);
        $("<input>")
            .attr({
                type: "hidden",
                id: "customerid",
                name: "customer_id",
                value: id,
            })
            .appendTo("#updateform");
        $.ajax({
            type: "GET",
            url: "/api/customer/" + id + "/edit",
            success: function (data) {
                console.log(data);
                $("#etitle").val(data.title);
                $("#euser_id").val(data.user_id);
                $("#elname").val(data.lname);
                $("#efname").val(data.fname);
                $("#eaddress").val(data.addressline);
                $("#etown").val(data.town);
                $("#ezipcode").val(data.zipcode);
                $("#ephone").val(data.phone);
                $("#ecreditlimit").val(data.creditlimit);
                $("#elevel").val(data.level);
            },
            error: function () {
                console.log("AJAX load did not work");
                alert("error");
            },
        });
    }); // Edit end

    $("#editModal").on("hidden.bs.modal", function (e) {
        $("#updateform").trigger("reset");
        $("#customerid").remove();
    }); // Edit modal reset end

    $("#updatebtn").on("click", function (e) {
        // e.preventDefault();
        var id = $("#customerid").val();
        var data = $("#updateform").serialize();
        console.log(data, id);
        $.ajax({
            type: "PUT",
            url: "api/customer/" + id,
            data: data,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            dataType: "json",
            success: function (data) {
                console.log(data);
                console.log("success");
                $("#editModal").each(function () {
                    $(this).modal("hide");
                });
            },
            error: function (error) {
                console.log("error");
            },
        });
    }); // Update btn end
}); //Document.ready end
