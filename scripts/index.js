let promise1=d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json')
let promise2=d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
let promise3=d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
let promises=[promise1,promise2,promise3]
Promise.all(promises).then((value)=>{
    let kick=value[0]
    let game = value[2]
    let movie=value[1]
    
    let cate=game.children.map((d)=>{
        return d.children[0].category
    })
    //console.log(movie)
    let w=1050
    let h=950
    let col=['#E57373','#CE93D8','#FF80AB','#9FA8DA','#2196F3','#B388FF','#03A9F4','#00838F','#009688','#A5D6A7','#8BC34A','#CDDC39','#FBC02D','#FFA726','#D84315','#795548','#90A4AE','#FFAB00']
    let color=d3.scaleOrdinal().domain(cate).range(col)
    
    let tooltip=d3.select('.let').append("div").attr("id", "tooltip")
    let svg=d3.select('.let').append('svg').attr('width',w).attr('height',h)
    let legend=d3.select('.let').append('div').append('svg').attr('width',1000).attr('height',80).attr('id','legend');
    svg.append("rect").attr("width", w).attr("height", 900).attr('fill','#2E7D32');
    //console.log(cate.length)
    let tree=d3.treemap().size([w,h-50]).paddingOuter(1).paddingInner(0.5).round(false)
    let root=d3.hierarchy(game).sum((d)=>d.value).sort((a,b)=>b.height-a.height || a.value - b.value);
    tree(root);
    //console.log(root.descendants())d3.nest().key(d => d.height).entries(root.descendants()).data((d)=>d.values).join('g')
    let node=svg.selectAll('g').data(root.leaves()).enter().append('g').attr('transform',(d)=>'translate('+d.x0+','+d.y0+')')
    //console.log(data)
    node.append('rect').attr('fill',(d)=>color(d.data.category)).attr('width',(d)=>d.x1-d.x0).attr('height',(d)=>d.y1-d.y0).attr('class',"tile")
    .attr("data-name", function(d){
        return d.data.name;
      })
    .attr("data-category", function(d){
        return d.data.category;
      })
    .attr("data-value", function(d){
        return d.data.value;
      })
    .on("mouseover", function(d) {  
        tooltip.style("opacity", 1); 
        tooltip.html(
          'Name: ' + d.data.name + 
          '<br>Category: ' + d.data.category + 
          '<br>Value: ' + d.data.value
        )
        .attr("data-value", d.data.value)
      })    
    .on("mouseout", function(d) { 
        tooltip.style("opacity", 0); 
      })
    .append('title').text((d)=>'Name: ' + d.data.name +'\nCategory: ' + d.data.category +'\nValue: ' + d.data.value)
    node.append('text').selectAll('tspan').data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); }).enter().append('tspan').attr('class', 'tiles').text(d=>d).attr("x", 4).attr("y", function(d, i) { return 13 + i * 10; })  
    
    legend.selectAll('rect').data(cate).enter().append('rect').attr('x',(d,i)=>(i*55)).attr('y',10).attr('height',30).attr('width',40).attr('class','legend-item').attr('fill',(d)=>color(d)).append('title').text((d,i)=>d+', '+col[i])
    legend.selectAll('text').data(cate).enter().append('text').attr('x',(d,i)=>(i*55)+10).attr('y',55).text((d)=>d)
})
