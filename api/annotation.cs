using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Documents.Client;
using System.Security.Claims;

namespace Microsoft.Function
{

    public class AnnotationItem
    {
        [JsonProperty("userId")]
        public string userId { get; set; }
        [JsonProperty("id")]
        public string id { get; set; }
        //[JsonProperty("annotations")]
        public object[] AnnotationJson { get; set; }
    }


    public static class Annotation
    {
        [FunctionName("saveAnnotation")]
        public static  void RunSave(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "annotation/{imageId}")] HttpRequest req,
            [CosmosDB(
                databaseName: "medimages",
                collectionName: "Annotations",
                ConnectionStringSetting = "CosmosDBConnection")
            ] out dynamic document,
            string imageId,
            ILogger log)
        {
            log.LogInformation($"C# save annotations for {imageId}");
            document = null;

            // Verify identity
            ClaimsPrincipal principal = ClientPrincipal.Parse(req);
            if (!principal.IsInRole("contributor"))
                return ;

            string userId = principal.Identity.Name;

            string requestBody = new StreamReader(req.Body).ReadToEnd();
            var input = JsonConvert.DeserializeObject<AnnotationItem>(requestBody);

            document = new { userId = userId, id = imageId, AnnotationJson = input.AnnotationJson }; //new object[] { requestBody } };
        }

        [FunctionName("getAnnotation")]
        public static async Task<IActionResult> RunGet(
           [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "annotation/{imageId}")] HttpRequest req,
            [CosmosDB(
                databaseName: "medimages",  
                collectionName: "Annotations",
                ConnectionStringSetting = "CosmosDBConnection")
           ]  DocumentClient client,
            string imageId,
            ILogger log)
        {
            log.LogInformation($"function GetAnnotations {imageId}");

            // Verify identity
            ClaimsPrincipal principal = ClientPrincipal.Parse(req);
            if (!principal.IsInRole("contributor"))
              return new UnauthorizedResult();

            string userId = principal.Identity.Name;
            AnnotationItem annotations = null;
            try
            {
                var response = await client.ReadDocumentAsync<AnnotationItem>(
                    UriFactory.CreateDocumentUri("medimages", "Annotations", imageId),
                    new RequestOptions { PartitionKey = new Microsoft.Azure.Documents.PartitionKey(userId) });

                annotations = (AnnotationItem)(dynamic)response;
                log.LogInformation($"function GetAnnotations invoked {imageId} {userId} {annotations}");
            }
            catch (Exception )
            {
                log.LogError($"Cant find Annotations entry for {userId}  Image {imageId} in cosmosdb");
                return new NotFoundResult();
            }
            log.LogInformation($"Retrieved annotation {annotations.AnnotationJson}");
            if ( annotations != null && annotations.AnnotationJson != null && annotations.AnnotationJson.Length > 0)
              return new OkObjectResult(annotations.AnnotationJson);
            else
              return new NotFoundResult();
        }
    }
}
