using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Microsoft.Function
{
    public static class Annotation
    {
        public class AnnotationItem
        {
            [JsonProperty("userId")]
            public string userId { get; set; }
            [JsonProperty("annotation")]
            public object[] AnnotationJson { get; set; }
        }
        
                [FunctionName("saveAnnotation")]
                public static async Task<IActionResult> RunSave(
                    [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "annotation/{userId}")] HttpRequest req,
                    [CosmosDB(
                        databaseName: "medimages",
                        collectionName: "Annotations",
                        ConnectionStringSetting = "CosmosDBConnection")
                    ]  DocumentClient client,
                    ILogger log)
                {
                    log.LogInformation("C# HTTP trigger function processed a request.");

                    //
                    
                    return new OkObjectResult(responseMessage);
                }

                [FunctionName("getAnnotation")]
                public static async Task<IActionResult> RunGet(
                   [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "annotation/{userId}")] HttpRequest req,
                    [CosmosDB(
                        databaseName: "medimages",
                        collectionName: "Annotations",
                        ConnectionStringSetting = "CosmosDBConnection")
                    ]  DocumentClient client,
                   ILogger log)
                {
                    log.LogInformation("C# HTTP trigger function processed a request.");

                    ClaimsPrincipal principal = ClientPrincipal.Parse(req);
                    string userId = principal.Identity.Name;
                    AnnotationItem annotationItem = null;
                    try
                    {
                        var response = await client.ReadDocumentAsync(
                            UriFactory.CreateDocumentUri("medimages", "Annotations", userId),
                            new RequestOptions { PartitionKey = new Microsoft.Azure.Documents.PartitionKey(userId) });

                        annotationItem = (AnnotationItem)(dynamic)response.Resource;

                    } catch (Exception e) {
                        log.LogError($"Cant find Annotation entry for {userId} in cosmosdb");
                    }

                    return new OkObjectResult(annotationItem.AnnotationJson[0]);
                }
    }
}
