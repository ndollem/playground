<?php
/*
 * Image from URL:
 * Read image data from a URL and place it in a PDF document
 * 
 * Read an image from the URL and store in a PDFlib virtual file (PVF). 
 * Then load the image data from the PVF file and place it on the page.
 *
 * Required software: PDFlib/PDFlib+PDI/PPS 10
 * Required data: none
 */
/* This is where the data files are. Adjust as necessary. */
$searchpath = dirname(__FILE__,3)."/input";
$outfile = "";
$title = "Image from URL";

$image_url = "https://www.pdflib.com/fileadmin/cookbooks/PDFlib/PDFlib-Cookbook/input/kraxi_logo.tif";


try {
    
    $p = new pdflib();

    $p->set_option("searchpath={" . $searchpath . "}");

    /* This means we must check return values of load_font() etc. */
    $p->set_option("errorpolicy=return");

    if ($p->begin_document($outfile, "") == 0)
        throw new Exception("Error: " . $p->get_errmsg());

    $p->set_info("Creator", "PDFlib Cookbook");
    $p->set_info("Title", $title);
    // Download image data from URL and store it in a PVF file
    if ($p->download("/pvf/image", "createpvf source={url=" . $image_url . "}") == 0)
        throw new Exception("Error: " . $p->get_errmsg());

    /* Load the image from the PVF */
    $image = $p->load_image("auto", "/pvf/image" , "");
    if ($image == 0)
        throw new Exception("Error: " . $p->get_errmsg());

    /* Start a page, place the image, and finish the page */
    $p->begin_page_ext(400, 200, "");
    $p->fit_image($image, 50, 100, "");
    $p->end_page_ext("");

    /* Delete the virtual file to free the allocated memory */
    $p->delete_pvf("/pvf/image");

    $p->end_document("");

    $buf = $p->get_buffer();
    $len = strlen($buf);

    header("Content-type: application/pdf");
    header("Content-Length: $len");
    header("Content-Disposition: inline; filename=image_from_url.pdf");
    print $buf;

} catch (PDFlibException $e) {
    print("PDFlib exception occurred:\n".
        "[" . $e->get_errnum() . "] " . $e->get_apiname() .
        ": " . $e->get_errmsg() . "\n");
    exit(1);
} catch (Throwable $e) {
    echo("PHP exception occurred: " . $e->getMessage() . "\n");
    exit(1);
}

$p = 0;

?>