const driver = neo4j.v1.driver("bolt://ws-10-0-1-112-33414.neo4jsandbox.com:443", neo4j.v1.auth.basic("neo4j", "set-policy-instruments"),{encrypted: true});
      const elem = document.getElementById('graph');
      const session = driver.session();
      const start = new Date()
      session
        .run('MATCH (n)-[r]->(m) RETURN { id: id(n), label:n.name, caption:n.name, community:n.community, size:CASE toInteger(n.outgoingDegree) WHEN 1.0 THEN 0.1 WHEN 0.0 THEN 0.1 ELSE log(toInteger(n.outgoingDegree)) END} as source, { id: id(m), label:m.name, caption:m.name, community:m.community, size:CASE toInteger(m.outgoingDegree) WHEN 1.0 THEN 0.1 WHEN 0.0 THEN 0.1 ELSE log(toInteger(m.outgoingDegree)) END} as target,{ weight:log(count(r)),ship:r.ship} as rel')
        .then(function (result) {
getData(result)
session.close();
 //event filtre select      
  $('#ships-pane').change(function() {
    var val = this.value;
    var newData = {};
    if(val!="all"){
   var filterdata = result.records.filter(function (item) {
  return item._fields[2].ship == val;
});
newData.records = filterdata}
else{
  newData=result
}
getData(newData)
});

        })
        .catch(function (error) {
          console.log(error);
        });
    //populate select with dynamic data from api   
        $.getJSON("/api/ships",
        function(data) {
            var select = $("#ships-pane");
            $.each(data,function(index,json){
            select.append($("<option></option>").attr("value", json.name).text(json.name+" ("+json.count+")"));
           }); 
        });
  function getData(data){
    const nodes = {};
        const links = data.records.map(r => { 
	       var source = r.get('source');if(isObject(source.id)){source.id = source.id.toNumber();}else{source.id=source.id}
           nodes[source.id] = source;
	       var target = r.get('target');if(isObject(target.id)){target.id = target.id.toNumber();}else{target.id=target.id}
           nodes[target.id] = target;
           var rel = r.get('rel');
	       return Object.assign({source:source.id,target:target.id}, rel);
	    });
      const gData = { nodes: Object.values(nodes), links: links}
      draw(gData)
  }    

  function draw(gData){
    const Graph = ForceGraph3D()(elem)
                      .graphData(gData)
                      .nodeVal('size')
                      .linkWidth('weight')
                      .nodeLabel(node => `${node.caption}`)
                      .nodeAutoColorBy('community')
                      .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null);

  }
  function isObject(a){
    return (typeof a === "object" && !Array.isArray(a) && a!== null);
  }