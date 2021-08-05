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
using System.Collections.Generic;


namespace Microsoft.Function
{
    
        public class IndexItem 
        {
            [JsonProperty("userId")]
            public string UserId { get; set; }
            public object[] IndexJson { get; set; }
        }

        public class IndexProps
        {
            [JsonProperty("imageIndex")]
            public string ImageIndex {get; set; }
            [JsonProperty("answerIndex")]
            public string AnswerIndex {get; set;}
        }
    
        public static class Progress 
        {
            [FunctionName("saveIndex")]
        public static  void RunSave(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "progress")] HttpRequest req,
            [CosmosDB(
                databaseName: "medimages",
                collectionName: "Progress",
                ConnectionStringSetting = "CosmosDBConnection")
            ] out dynamic document,
            ILogger log)
        {
            log.LogInformation($"C# save index ");
            document = null;

            // Verify identity
            ClaimsPrincipal principal = ClientPrincipal.Parse(req);
            if (!principal.IsInRole("contributor"))
                return;

            string userId = principal.Identity.Name;

            string requestBody = new StreamReader(req.Body).ReadToEnd();
            var input = JsonConvert.DeserializeObject<IndexProps>(requestBody);
            

            document = new { id = userId, userId = userId, IndexJson = input }; //new object[] { requestBody } };
        }
            [FunctionName("getIndex")]
            public static async Task<IActionResult> RunGet(
                [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "progress")] HttpRequest req,
                [CosmosDB(
                    databaseName: "medimages",
                    collectionName: "Progress",
                    ConnectionStringSetting = "CosmosDBConnection")
                ]  DocumentClient client,
                ILogger log)
            {
                log.LogInformation($"function GetQuestions ");

                // Verify identity
                ClaimsPrincipal principal = ClientPrincipal.Parse(req);
                if (!principal.IsInRole("contributor"))
                    return new UnauthorizedResult();

                string userId = principal.Identity.Name;
                IndexItem indices = null;
                try
                {
                    var response = await client.ReadDocumentAsync<IndexItem>(
                        UriFactory.CreateDocumentUri("medimages", "Progress", userId),
                        new RequestOptions { PartitionKey = new Microsoft.Azure.Documents.PartitionKey(userId) });

                    indices = (IndexItem)(dynamic)response.Resource;
                    log.LogInformation($"function GetQuestions invoked");

                } catch (Exception ) {
                    log.LogError($"Cant find Questions entry for  in cosmosdb");
                    return new NotFoundResult();
                }
                log.LogInformation($"Retrieved questions ");
                if ( indices != null && indices.IndexJson != null)
                  return new OkObjectResult(indices.IndexJson);
                else
                  return new NotFoundResult();
            }
        }
}
