function zoomFit2(svg, foreground) {

    const c_bounds = new Object()
    const sel = foreground.select(".metro").selectAll("circle").nodes()
    c_bounds.left = Math.min(...sel.map(d => d.__data__.x))
    c_bounds.right = Math.max(...sel.map(d => d.__data__.x))
    c_bounds.top = Math.min(...sel.map(d => d.__data__.y))
    c_bounds.bottom = Math.max(...sel.map(d => d.__data__.y))
    c_bounds.width = c_bounds.right - c_bounds.left
    c_bounds.height = c_bounds.bottom - c_bounds.top

    const p_bounds = new Object()
    p_bounds.width = svg.node().viewBox.baseVal.width
    p_bounds.height = svg.node().viewBox.baseVal.width
    p_bounds.left = svg.node().viewBox.baseVal.x
    p_bounds.top = svg.node().viewBox.baseVal.y
    p_bounds.right = p_bounds.left + p_bounds.width
    p_bounds.bottom = p_bounds.top + p_bounds.height

    const cw = c_bounds.width,
        ch = c_bounds.height,
        cx = c_bounds.left+c_bounds.width/2,
        cy = c_bounds.top+c_bounds.height/2,
        pw = p_bounds.width,
        ph = p_bounds.height,
        px = p_bounds.left+p_bounds.width/2,
        py = p_bounds.top+p_bounds.height/2; // not sure why this isn't 2

    const k = 0.8 * Math.min(pw/cw, ph/ch);

    return d3.zoomIdentity.translate(px, 1.5*k*ch/2).scale(k).translate(-cx, -cy);
}